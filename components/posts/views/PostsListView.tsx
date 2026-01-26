export default function PostsListView() {
  return (
    <div className="space-y-4">
      <div className="border rounded-xl p-4">
        <p className="font-medium">YouTube Post</p>
        <p className="text-sm text-muted-foreground">
          Scheduled for Aug 21, 14:30
        </p>
      </div>

      <div className="border rounded-xl p-4">
        <p className="font-medium">Instagram Reel</p>
        <p className="text-sm text-muted-foreground">Posted immediately</p>
      </div>
    </div>
  );
}
