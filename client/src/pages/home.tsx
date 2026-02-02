import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Trophy, AlertCircle, Key, Settings2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { searchTeamsReal, validateApiKey } from "@/lib/tba";
import { searchTeams as searchTeamsMock } from "@/lib/mock-tba";
import { type Team } from "@/lib/types";
import { TeamCard } from "@/components/team-card";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";

// Import the generated background image
import heroBg from "@assets/generated_images/futuristic_robotics_competition_arena_background.png";

const formSchema = z.object({
  regional: z.string().min(2, "Regional name must be at least 2 characters"),
  year: z.string().regex(/^\d{4}$/, "Must be a valid year (e.g., 2024)"),
});

export default function Home() {
  const [results, setResults] = useState<Team[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Accessing The Blue Alliance Database...");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      regional: "",
      year: new Date().getFullYear().toString(),
    },
  });

  // Use the provided API key
  const API_KEY = "nrmyzS11DXKYrKuTYscr5L9frhql59DkXA0wa4Vopz4W8Bb4l9HahdTF6j32Zae7";

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResults(null);
    setStatusMessage("Searching for event...");

    try {
      // Real API Search
      setStatusMessage("Authenticating with The Blue Alliance...");
      const isValid = await validateApiKey(API_KEY);
      
      if (!isValid) {
        throw new Error("TBA API Key validation failed.");
      }

      setStatusMessage("Fetching event teams...");
      const teams = await searchTeamsReal(values.regional, values.year, API_KEY);
      setResults(teams);
      
      if (teams.length === 0) {
        toast({
          title: "No matches found",
          description: "We found the event, but no teams have won Impact/Chairman's since 2022.",
          variant: "default",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden font-sans selection:bg-primary/30">
      {/* Background with overlay */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />

      {/* Grid Overlay */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
            backgroundImage: `linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)`,
            backgroundSize: "40px 40px"
        }}
      />

      <main className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center min-h-screen">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 space-y-4 max-w-2xl"
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4 border border-primary/20">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-primary/50">
            IMPACT SCOUTER
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl font-light">
            Identify teams at your regional with a history of excellence.
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md mb-16"
        >
          <div className="bg-card/30 backdrop-blur-md border border-primary/20 p-6 rounded-xl shadow-2xl shadow-primary/5">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="regional"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary/80 font-display tracking-wide uppercase text-xs">Event Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. Silicon Valley" 
                          {...field} 
                          className="bg-background/50 border-primary/20 focus:border-primary/60 h-12 text-lg"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Enter part of the event name (e.g. "Sacramento")
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary/80 font-display tracking-wide uppercase text-xs">Competition Year</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          className="bg-background/50 border-primary/20 focus:border-primary/60 h-12 text-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-display tracking-wider bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      SCOUTING...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      FIND TEAMS
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </motion.div>

        {/* Results Section */}
        <div className="w-full max-w-6xl">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 space-y-4"
              >
                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-primary/60 font-mono animate-pulse">{statusMessage}</p>
              </motion.div>
            )}

            {!loading && results && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {results.map((team, index) => (
                  <TeamCard key={team.team_number} team={team} index={index} />
                ))}
              </motion.div>
            )}

            {!loading && results && results.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 space-y-4 text-muted-foreground"
              >
                <AlertCircle className="h-12 w-12 mx-auto opacity-20" />
                <p>No teams found matching your criteria.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
