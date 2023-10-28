export interface PaginatedItemI<T> {
    current_page: number;
    last_page: number;
    next_page: number;
    total: number;
    data: Array<T>;
}
