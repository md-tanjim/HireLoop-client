import { Trash2, Trash2Icon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { deleteJobById } from "@/lib/actions/jobs";

export function DeleteJobDialog({jobId , jobData}: {jobId: string; jobData: {title: string}}) {

    const [deleting, setDeleting] = useState(false);

    const router = useRouter();

    // const res = deleteJobById(jobId);
    

    // const handleDelete = async () => {
        
    
    //     const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
    
    //     if (!apiUrl) {
    //       toast.error("API URL is not configured.");
    //       return;
    //     }
    
    //     setDeleting(true);
    
    //     try {
    //       const res = await fetch(
    //         `${apiUrl}/delete-job/${encodeURIComponent(jobId)}`,
    //         {
    //           method: "DELETE",
    //           headers: {
    //             "Content-Type": "application/json",
    //           },
    //         }
    //       );
    
    //       const result = await res.json().catch(() => null);
    
    //       if (!res.ok) {
    //         throw new Error(
    //           result?.message || "Failed to delete job."
    //         );
    //       }
    
    //       toast.success(result?.message || "Job deleted successfully!");
    
    //       // Refresh server-rendered job listings
    //       router.refresh();
    
    //     } catch (error) {
    //       console.error("Delete job error:", error);
    
    //       toast.error(
    //         error instanceof Error
    //           ? error.message
    //           : "Something went wrong."
    //       );
    //     } finally {
    //       setDeleting(false);
    //     }
    //   };
    


    const handleDelete = async () => {
    setDeleting(true);

    try {
      // Call the external deletion function
      const result = await deleteJobById(jobId);

      // Show success message from the API result
      toast.success(result?.message || "Job deleted successfully!");

      // Refresh server-rendered job listings
      router.refresh();

    } catch (error) {
      console.error("Delete job error:", error);

      // Handle configuration or network errors thrown by deleteJobById
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setDeleting(false);
    }
};




  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button variant="destructive"> <Trash2 className="size-4" /> </Button>}
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete Job?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this job posting.
            
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" >Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
