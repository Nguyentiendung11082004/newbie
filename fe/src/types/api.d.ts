export interface Pagination {
    totalDocs: number;
    totalPages: number;
    page: number;
    limit: number;
}

export interface ApiResponse<T> {
    status: string | number;
    message: string;
    data: T;
    pagination: Pagination;
    StatusCodes: string | number;
}
