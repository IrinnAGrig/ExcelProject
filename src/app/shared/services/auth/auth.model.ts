export interface LoginData {
    email: string;
    password: string;
}
export interface SignUpData {
    email: string;
    fullName: string;
    password: string;
}
export interface UserDetails {
    id: string;
    email: string;
    fullName: string;
    image: string;
    password: string;
    projects: string[];
}