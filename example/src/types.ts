import type { ParamListBase } from '@react-navigation/native';

export enum Route {
  Home = 'Home',
  BasicVideoPlayer = 'BasicVideoPlayer',
  BasicVideoComposition = 'BasicVideoComposition',
}

export interface StackParamList extends ParamListBase {
  Home: undefined;
  BasicVideoPlayer: undefined;
  BasicVideoComposition: undefined;
}

// https://reactnavigation.org/docs/typescript#specifying-default-types-for-usenavigation-link-ref-etc
declare global {
  namespace ReactNavigation {
    interface RootParamList extends StackParamList {}
  }
}
