import { motion } from "framer-motion";
import { FileText, MapPin, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Team } from "@/lib/types";

interface TeamCardProps {
  team: Team;
  index: number;
}

export function TeamCard({ team, index }: TeamCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="h-full bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-colors group">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-display text-primary flex items-baseline gap-2">
                <span className="text-lg opacity-70">#</span>{team.team_number}
              </CardTitle>
              <h3 className="text-xl font-bold mt-1 text-foreground/90 group-hover:text-primary transition-colors">
                {team.nickname}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <MapPin className="h-4 w-4" />
            <span>{team.city}, {team.state_prov}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-primary/80 uppercase tracking-wider">
              <Trophy className="h-4 w-4" />
              <span>Award History</span>
            </div>
            <div className="space-y-2">
              {team.awards.map((award, i) => {
                const essayUrl = `https://info.firstinspires.org/hubfs/web/program/frc/awards/fia-essays/${award.year}/${team.team_number}.pdf`;
                return (
                  <div 
                    key={i} 
                    className="bg-primary/5 border border-primary/10 rounded-md p-2 text-sm flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground/90">{award.name}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a
                              href={essayUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary hover:text-primary/80 transition-colors"
                            >
                              <FileText className="h-4 w-4" />
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Read Winning Essay</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Badge variant="outline" className={`border-primary/30 ${award.year >= 2022 ? "bg-primary/20 text-primary font-bold" : "text-muted-foreground"}`}>
                      {award.year}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
