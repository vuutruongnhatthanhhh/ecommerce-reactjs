import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUsers, deleteUser } from "@/services/userService";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

type User = {
  id: number;
  name: string;
  username: string;
  role: string;
  createdAt: string;
};

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const params: any = {
        page,
        limit: 5,
      };
      if (search) params.search = search;
      if (role !== "ALL") params.role = role;

      const res = await getUsers(params);
      setUsers(res.data);
      setTotalPages(res.totalPages);
    } catch (err) {
      toast.error("Không thể lấy danh sách người dùng");
      console.error(err);
    }
  };

  // debounce searchInput -> search
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
      setPage(1); // reset về trang đầu khi search thay đổi
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, role, page]);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Xác nhận xoá người dùng?");
    if (!confirmDelete) return;

    try {
      await deleteUser(id);
      toast.success("Đã xoá người dùng");
      fetchUsers();
    } catch (err) {
      toast.error("Xoá người dùng thất bại");
      console.error(err);
    }
  };

  return (
    <div>
      <div className="mb-4 space-y-2">
        <h1 className="text-xl font-bold">Quản lý người dùng</h1>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate("/admin/users/new")}
        >
          + Thêm người dùng
        </Button>
      </div>

      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <Input
          placeholder="Tìm kiếm theo tên hoặc username..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-64"
        />
        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-2 rounded bg-white"
        >
          <option value="ALL">Tất cả vai trò</option>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>

      {/* Danh sách người dùng */}
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex justify-between border p-4 rounded items-center"
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold break-all">
                {user.name} ({user.role})
              </p>
              <p className="text-sm text-muted-foreground break-all">
                {user.username}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/admin/users/${user.id}`)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(user.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Phân trang */}
      <div className="flex justify-center gap-2 mt-4">
        <Button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          variant="outline"
        >
          Trang trước
        </Button>
        <span className="flex items-center px-2 text-sm">
          Trang {page} / {totalPages}
        </span>
        <Button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          variant="outline"
        >
          Trang sau
        </Button>
      </div>
    </div>
  );
};

export default UserList;
