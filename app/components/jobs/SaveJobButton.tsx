"use client";

import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  saveJob,
  removeSavedJob,
} from "@/lib/api/savedJobs";

type SaveJobButtonProps = {
  seekerId: string;
  jobId: string;
  initialSaved: boolean;
  onSavedChange: (jobId: string, saved: boolean) => void;
};

export default function SaveJobButton({
  seekerId,
  jobId,
  initialSaved,
  onSavedChange,
}: SaveJobButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Keep the local button state synchronized with the parent.
  useEffect(() => {
    // eslint-disable-next-line
    setIsSaved(initialSaved);
  }, [initialSaved]);

  const handleToggleSave = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setMessage("");

    try {
      if (isSaved) {
        await removeSavedJob(seekerId, jobId);

        setIsSaved(false);
        onSavedChange(jobId, false);
      } else {
        await saveJob(seekerId, jobId);

        setIsSaved(true);
        onSavedChange(jobId, true);
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex shrink-0 flex-col items-end gap-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isLoading}
        onClick={handleToggleSave}
        aria-label={isSaved ? "Remove saved job" : "Save job"}
        className={
          isSaved
            ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
            : "border-white/10 bg-transparent text-muted-foreground hover:bg-white/5 hover:text-white"
        }
      >
        {isLoading ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : isSaved ? (
          <BookmarkCheck className="mr-2 size-4" />
        ) : (
          <Bookmark className="mr-2 size-4" />
        )}

        {isSaved ? "Saved" : "Save"}
      </Button>

      {message && (
        <p
          role="alert"
          className="max-w-40 text-right text-xs text-red-400"
        >
          {message}
        </p>
      )}
    </div>
  );
}