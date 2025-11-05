import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex pt-20 flex-col items-center justify-center bg-background px-4">
      <h1 className="text-6xl font-bold text-blue-600">404</h1>
      <p className="mt-2 text-lg text-muted-foreground">Trang không tồn tại</p>

      <Button
        asChild
        className="mt-6 text-base px-6 py-4 bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
      >
        <a href="/">
          <Home className="mr-2 h-5 w-5" />
          Quay về trang chủ
        </a>
      </Button>
    </div>
  );
}
