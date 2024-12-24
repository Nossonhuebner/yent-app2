import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  '(auth)': undefined;
  '(app)': undefined;
  'index': undefined;
};

export type AuthStackParamList = {
  login: undefined;
  register: undefined;
};

export type AppStackParamList = {
  groups: undefined;
  'chat/[id]': { id: string };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = 
  NativeStackScreenProps<AuthStackParamList, T>;

export type AppStackScreenProps<T extends keyof AppStackParamList> = 
  NativeStackScreenProps<AppStackParamList, T>; 