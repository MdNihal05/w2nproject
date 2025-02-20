export type FileType = {
    url: string,
    name: string
}
export type Bill = {
    _id: string;
    category: string;
    amount: number;
    note: string;
    date: string;
    files: FileType[];
    name: string;
};

export type FormData = {
    name: string;
    category: string;
    amount: string;
    note: string;
    date: string;
    files: File[];
};