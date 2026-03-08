import { useMemo, useState } from "react";
import { NewsArticle } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Building2, MapPin, Cpu } from "lucide-react";

interface Props {
  articles: NewsArticle[];
}

interface EntityRelationship {
  source: string;
  target: string;
  sourceType: string;
  targetType: string;
  weight: number;
}

const TYPE_ICONS = {
  people: Users,
  organizations: Building2,
  locations: MapPin,
  technologies: Cpu,
};

const TYPE_COLORS: Record<string, string> = {
  people: "hsl(var(--primary))",
  organizations: "hsl(var(--accent))",
  locations: "hsl(var(--warning))",
  technologies: "hsl(var(--success))",
};

export function KnowledgeGraph({ articles }: Props) {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);

  const allEntities = useMemo(() => {
    const entityMap: Record<string, { type: string; count: number; articles: string[] }> = {};

    articles.forEach((a) => {
      if (!a.entities) return;
      const ents = a.entities;
      (["people", "organizations", "locations", "technologies"] as const).forEach((type) => {
        (ents[type] || []).forEach((name) => {
          const key = `${type}:${name}`;
          if (!entityMap[key]) entityMap[key] = { type, count: 0, articles: [] };
          entityMap[key].count++;
          entityMap[key].articles.push(a.title);
        });
      });
    });

    return Object.entries(entityMap)
      .map(([key, val]) => ({ name: key.split(":").slice(1).join(":"), ...val }))
      .sort((a, b) => b.count - a.count);
  }, [articles]);

  const relationships = useMemo(() => {
    const rels: Record<string, EntityRelationship> = {};

    articles.forEach((a) => {
      if (!a.entities) return;
      const allEnts: { name: string; type: string }[] = [];
      (["people", "organizations", "locations", "technologies"] as const).forEach((type) => {
        (a.entities![type] || []).forEach((name) => {
          allEnts.push({ name, type });
        });
      });

      // Create pairwise relationships within same article
      for (let i = 0; i < allEnts.length; i++) {
        for (let j = i + 1; j < allEnts.length; j++) {
          const key = [allEnts[i].name, allEnts[j].name].sort().join("||");
          if (!rels[key]) {
            rels[key] = {
              source: allEnts[i].name,
              target: allEnts[j].name,
              sourceType: allEnts[i].type,
              targetType: allEnts[j].type,
              weight: 0,
            };
          }
          rels[key].weight++;
        }
      }
    });

    return Object.values(rels).sort((a, b) => b.weight - a.weight).slice(0, 30);
  }, [articles]);

  const entityByType = useMemo(() => {
    const grouped: Record<string, typeof allEntities> = {
      people: [], organizations: [], locations: [], technologies: [],
    };
    allEntities.forEach((e) => {
      if (grouped[e.type]) grouped[e.type].push(e);
    });
    return grouped;
  }, [allEntities]);

  const selectedRelations = useMemo(() => {
    if (!selectedEntity) return [];
    return relationships.filter(
      (r) => r.source === selectedEntity || r.target === selectedEntity
    );
  }, [selectedEntity, relationships]);

  if (!allEntities.length) {
    return (
      <div className="glass-card rounded-lg p-6 text-center text-muted-foreground">
        <p className="text-sm">No entity data available yet. Scan some news to build the knowledge graph.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Entity Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["people", "organizations", "locations", "technologies"] as const).map((type) => {
          const Icon = TYPE_ICONS[type];
          return (
            <div key={type} className="glass-card rounded-lg p-4 text-center">
              <Icon className="h-5 w-5 mx-auto mb-2" style={{ color: TYPE_COLORS[type] }} />
              <p className="text-2xl font-bold text-foreground">{entityByType[type].length}</p>
              <p className="text-xs text-muted-foreground capitalize">{type}</p>
            </div>
          );
        })}
      </div>

      <Tabs defaultValue="graph" className="w-full">
        <TabsList>
          <TabsTrigger value="graph">Relationship Graph</TabsTrigger>
          <TabsTrigger value="entities">All Entities</TabsTrigger>
        </TabsList>

        <TabsContent value="graph">
          <div className="glass-card rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Entity Relationships</h3>
            <p className="text-xs text-muted-foreground mb-4">Click an entity to see its connections. Thickness indicates co-occurrence frequency.</p>

            {/* Interactive Graph Visualization */}
            <div className="relative w-full" style={{ height: 400 }}>
              <svg width="100%" height="100%" viewBox="0 0 800 400">
                {/* Relationship lines */}
                {relationships.slice(0, 20).map((rel, i) => {
                  const topEntities = allEntities.slice(0, 20);
                  const si = topEntities.findIndex((e) => e.name === rel.source);
                  const ti = topEntities.findIndex((e) => e.name === rel.target);
                  if (si === -1 || ti === -1) return null;

                  const sx = 100 + (si % 5) * 150;
                  const sy = 60 + Math.floor(si / 5) * 90;
                  const tx = 100 + (ti % 5) * 150;
                  const ty = 60 + Math.floor(ti / 5) * 90;

                  const isHighlighted = selectedEntity && (rel.source === selectedEntity || rel.target === selectedEntity);

                  return (
                    <line
                      key={i}
                      x1={sx} y1={sy} x2={tx} y2={ty}
                      stroke={isHighlighted ? "hsl(var(--primary))" : "hsl(var(--border))"}
                      strokeWidth={Math.min(rel.weight * 2, 6)}
                      opacity={selectedEntity ? (isHighlighted ? 0.8 : 0.1) : 0.3}
                    />
                  );
                })}

                {/* Entity nodes */}
                {allEntities.slice(0, 20).map((entity, i) => {
                  const x = 100 + (i % 5) * 150;
                  const y = 60 + Math.floor(i / 5) * 90;
                  const isSelected = selectedEntity === entity.name;
                  const radius = Math.min(8 + entity.count * 3, 24);

                  return (
                    <g
                      key={entity.name}
                      onClick={() => setSelectedEntity(isSelected ? null : entity.name)}
                      style={{ cursor: "pointer" }}
                    >
                      <circle
                        cx={x} cy={y} r={radius}
                        fill={TYPE_COLORS[entity.type]}
                        opacity={selectedEntity ? (isSelected ? 1 : 0.4) : 0.8}
                        stroke={isSelected ? "hsl(var(--foreground))" : "none"}
                        strokeWidth={2}
                      />
                      <text
                        x={x} y={y + radius + 14}
                        textAnchor="middle"
                        fontSize={10}
                        fill="hsl(var(--muted-foreground))"
                        className="select-none"
                      >
                        {entity.name.length > 15 ? entity.name.substring(0, 15) + "…" : entity.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Selected entity details */}
            {selectedEntity && (
              <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm font-semibold text-foreground mb-2">🔗 {selectedEntity}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedRelations.map((r, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      ↔ {r.source === selectedEntity ? r.target : r.source}
                      <span className="ml-1 text-muted-foreground">({r.weight})</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="entities">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(["people", "organizations", "locations", "technologies"] as const).map((type) => {
              const Icon = TYPE_ICONS[type];
              const entities = entityByType[type].slice(0, 10);
              if (!entities.length) return null;

              return (
                <div key={type} className="glass-card rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Icon className="h-4 w-4" style={{ color: TYPE_COLORS[type] }} />
                    <span className="capitalize">{type}</span>
                  </h3>
                  <div className="space-y-2">
                    {entities.map((e) => (
                      <div key={e.name} className="flex items-center justify-between">
                        <span className="text-sm text-foreground truncate">{e.name}</span>
                        <Badge variant="outline" className="text-xs">{e.count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
