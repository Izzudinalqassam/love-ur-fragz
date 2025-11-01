import React from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, Sparkles } from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import type { Perfume } from "../../lib/api";

interface PerfumeCardProps {
  perfume: Perfume;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

const PerfumeCard: React.FC<PerfumeCardProps> = ({
  perfume,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      <div className="relative">
        {/* Image Placeholder */}
        <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          {perfume.concentration && (
            <Badge className="absolute top-4 right-4 bg-yellow-500 text-white">
              {perfume.concentration}
            </Badge>
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <p className="text-gray-600 font-medium">{perfume.brand}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col gap-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-white/90 backdrop-blur-sm hover:bg-white"
              onClick={() => onToggleFavorite(perfume.id)}
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorite ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 font-serif mb-1">
            {perfume.name}
          </h3>
          <p className="text-sm text-gray-600 font-medium">{perfume.brand}</p>
        </div>

        {perfume.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {perfume.description}
          </p>
        )}

        {/* Aroma Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {perfume.aroma_tags.slice(0, 3).map((tag) => (
            <Badge key={tag.id} variant="aroma" size="sm">
              {tag.name}
            </Badge>
          ))}
          {perfume.aroma_tags.length > 3 && (
            <Badge variant="outline" size="sm">
              +{perfume.aroma_tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Notes Display */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>
              Top:{" "}
              {perfume.notes
                ?.filter((n) => n.type === "top")
                .map((n) => n.note_name)
                .join(", ") || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>
              Middle:{" "}
              {perfume.notes
                ?.filter((n) => n.type === "middle")
                .map((n) => n.note_name)
                .join(", ") || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>
              Base:{" "}
              {perfume.notes
                ?.filter((n) => n.type === "base")
                .map((n) => n.note_name)
                .join(", ") || "N/A"}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900">
            ${perfume.price}
          </div>
          <div className="flex gap-2">
            <Link to={`/perfume/${perfume.id}`}>
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="sm"
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerfumeCard;
