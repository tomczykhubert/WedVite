"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Image as ImageIcon, Loader2, X } from "lucide-react";

export interface UploadingFile {
  id: string; // Add unique identifier
  file: File;
  progress: number;
  error?: string;
}

interface UploadProgressProps {
  files: UploadingFile[];
  onRemove: (id: string) => void; // Change to use id instead of file
}

export function UploadProgress({ files, onRemove }: UploadProgressProps) {
  if (files.length === 0) return null;

  return (
    <div className="space-y-2">
      {files.map(({ id, file, progress, error }) => (
        <Card key={id} className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {error ? (
                <X className="h-5 w-5 text-destructive" />
              ) : progress === 100 ? (
                <ImageIcon className="h-5 w-5 text-green-600" />
              ) : (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              {error ? (
                <p className="text-xs text-destructive">{error}</p>
              ) : (
                <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
            {error && (
              <Button variant="ghost" size="sm" onClick={() => onRemove(id)}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
