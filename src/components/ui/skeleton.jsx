import { Skeleton } from "@/components/ui/skeleton"

function UserCardLoading() {
  return (
    <div className="p-4 border rounded-md">
      <Skeleton className="h-6 w-1/2 mb-2" />
      <Skeleton className="h-4 w-full" />
    </div>
  )
}
