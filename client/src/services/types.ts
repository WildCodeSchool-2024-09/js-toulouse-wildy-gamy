export interface User {
  id: number;
  name: string;
  firstname: string;
  email: string;
  username: string;
  password_hash: string;
  phone_number: string;
  profile_pic?: string;
  total_points: number;
  current_points: number;
  is_admin: boolean;
  is_banned?: boolean;
}

export interface BaseItem {
  id: number;
  name: string;
  USER_ID?: number;
  username?: string;
  firstname?: string;
  email?: string;
  phone_number?: string;
  profile_pic?: string;
  total_points?: number;
  current_points?: number;
  is_admin?: boolean;
  description?: string;
  image?: string;
  is_available: boolean;
}

export interface Game extends BaseItem {
  price: number;
  is_new: boolean;
}

export interface Prize extends BaseItem {
  exchange_price: number;
}

export interface Favorite {
  id: number;
  user_id: number;
  game_id: number;
}

export interface PrizeAcquired {
  id: number;
  user_id: number;
  prize_id: number;
  acquisition_date: Date;
}

export interface GameSaveData {
  name: string;
  description: string;
  image: string;
  price: string;
}

export interface PrizeSaveData {
  name: string;
  description: string;
  image: string;
  exchange_price: string;
}

export interface UserSaveData {
  name: string;
  firstname: string;
  email: string;
  username: string;
  phone_number: string;
  profile_pic: string;
  is_admin: boolean;
}

export interface ModalProps<
  T extends GameSaveData | PrizeSaveData | UserSaveData,
> {
  isOpen: boolean;
  onClose: () => void;
  gameData?: GameSaveData;
  prizeData?: PrizeSaveData;
  userData?: UserSaveData;
  onSave: (updatedData: T) => void;
  mode: "edit" | "add";
}

// Types pour les réponses API
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Types pour les requêtes API
export interface LoginRequest {
  username: string;
  password: string;
}

export interface CreateUserRequest {
  name: string;
  firstname: string;
  email: string;
  username: string;
  password: string;
  phone_number?: string;
  profile_pic?: string;
}

export interface UpdateUserRequest {
  name?: string;
  firstname?: string;
  email?: string;
  username?: string;
  password?: string;
  phone_number?: string;
  profile_pic?: string;
  total_points?: number;
  current_points?: number;
}
