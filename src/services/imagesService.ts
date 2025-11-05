import { api } from "@/services/api"; // instance tự gắn Authorization: Bearer ...

export interface Image {
  id?: number;
  url: string;
  name: string;
  category: string;
}

/** ================== UPLOAD / DELETE / GET: ĐỀU CẦN AUTH ================== */

// Upload ảnh (multipart/form-data)
export const uploadImage = async (
  file: File,
  folder: string
): Promise<Image> => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await api.post(`/cloudinary/upload`, formData, {
    params: { folder },
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Xoá ảnh (body: { url })
export const deleteImage = async (image: Image): Promise<void> => {
  await api.delete(`/cloudinary/delete`, {
    data: { url: image.url },
  });
};

// Lấy danh sách ảnh có phân trang + filter
export const getAllImage = async (
  page: number,
  limit: number,
  search: string,
  filter: { type: string }
): Promise<{ images: Image[]; total: number }> => {
  const res = await api.get(`/cloudinary/images`, {
    params: {
      page,
      limit,
      search,
      category: filter.type,
    },
  });

  return {
    images: res.data.data,
    total: res.data.total,
  };
};
