import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink, Search } from "lucide-react";

interface KBArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  relevanceScore: number;
  url?: string;
  lastUpdated: Date;
}

interface KnowledgeBaseSectionProps {
  incidentTitle: string;
  incidentDescription: string;
  incidentCategory: string;
}

// Mock KB articles - in a real app, this would come from an API
const mockKBArticles: KBArticle[] = [
  {
    id: "1",
    title: "Email Server Troubleshooting Guide",
    summary:
      "Step-by-step guide to diagnose and resolve common email server issues including connectivity problems, authentication failures, and performance issues.",
    category: "Email",
    tags: ["email", "server", "troubleshooting", "connectivity"],
    relevanceScore: 95,
    lastUpdated: new Date(2024, 5, 1),
  },
  {
    id: "2",
    title: "SMTP Configuration Best Practices",
    summary:
      "Complete guide for configuring SMTP settings, including port configurations, security protocols, and authentication methods.",
    category: "Email",
    tags: ["smtp", "configuration", "security", "authentication"],
    relevanceScore: 88,
    lastUpdated: new Date(2024, 4, 15),
  },
  {
    id: "3",
    title: "Server Performance Monitoring",
    summary:
      "How to monitor server performance, identify bottlenecks, and optimize system resources for better performance.",
    category: "Infrastructure",
    tags: ["performance", "monitoring", "server", "optimization"],
    relevanceScore: 75,
    lastUpdated: new Date(2024, 5, 10),
  },
  {
    id: "4",
    title: "Network Connectivity Issues Resolution",
    summary:
      "Comprehensive guide to diagnose and resolve network connectivity problems affecting email and other services.",
    category: "Network",
    tags: ["network", "connectivity", "troubleshooting", "email"],
    relevanceScore: 82,
    lastUpdated: new Date(2024, 4, 28),
  },
  {
    id: "5",
    title: "High CPU Usage Investigation",
    summary:
      "Methods to identify processes causing high CPU usage and steps to resolve performance degradation.",
    category: "Performance",
    tags: ["cpu", "performance", "investigation", "server"],
    relevanceScore: 78,
    lastUpdated: new Date(2024, 5, 5),
  },
];

const KnowledgeBaseSection = ({
  incidentTitle,
  incidentDescription,
  incidentCategory,
}: KnowledgeBaseSectionProps) => {
  const [relevantArticles, setRelevantArticles] = useState<KBArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to find relevant KB articles
    const findRelevantArticles = () => {
      const searchTerms = [
        ...incidentTitle.toLowerCase().split(" "),
        ...incidentDescription.toLowerCase().split(" "),
        incidentCategory.toLowerCase(),
      ];

      // Filter and score articles based on relevance
      const scored = mockKBArticles.map((article) => {
        let score = 0;

        // Check category match (highest weight)
        if (article.category.toLowerCase() === incidentCategory.toLowerCase()) {
          score += 50;
        }

        // Check title and summary for keywords
        const articleText = `${article.title} ${article.summary}`.toLowerCase();
        searchTerms.forEach((term) => {
          if (term.length > 3 && articleText.includes(term)) {
            score += 10;
          }
        });

        // Check tags
        article.tags.forEach((tag) => {
          searchTerms.forEach((term) => {
            if (term.length > 3 && tag.includes(term)) {
              score += 15;
            }
          });
        });

        return { ...article, relevanceScore: score };
      });

      // Sort by relevance and take top 3
      const relevant = scored
        .filter((article) => article.relevanceScore > 20)
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 3);

      setRelevantArticles(relevant);
      setLoading(false);
    };

    // Simulate network delay
    setTimeout(findRelevantArticles, 800);
  }, [incidentTitle, incidentDescription, incidentCategory]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Knowledge Base
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (relevantArticles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Knowledge Base
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">
              No relevant articles found for this incident.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Knowledge Base ({relevantArticles.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {relevantArticles.map((article) => (
          <div
            key={article.id}
            className="border-l-4 border-blue-200 pl-4 py-2"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-gray-900 leading-tight">
                {article.title}
              </h4>
              <Badge variant="secondary" className="ml-2 text-xs">
                {Math.round(article.relevanceScore)}% match
              </Badge>
            </div>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {article.summary}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {article.category}
                </Badge>
                <span className="text-xs text-gray-500">
                  Updated {article.lastUpdated.toLocaleDateString()}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                View Article
              </Button>
            </div>

            {article.tags.length > 0 && (
              <div className="flex gap-1 mt-2">
                {article.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {article.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{article.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        ))}

        <div className="pt-2">
          <Button variant="outline" className="w-full">
            <Search className="h-4 w-4 mr-2" />
            Search All Knowledge Base Articles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeBaseSection;
