export type INavItem =
    | {
          name: string;
          icon?: JSX.Element;
          children?: INavItem[];
          content?: JSX.Element;
      }
    | {divider: true};
