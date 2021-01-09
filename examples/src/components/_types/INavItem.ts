export type INavItem =
    | {
          name: string;
          icon?: JSX.Element;
          children?: INavItem[];
          content?: JSX.Element;
          apiLink?: string[];
      }
    | {divider: true};
