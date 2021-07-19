import React from "react";

import { Profile } from "src/types/Types.context";
import { FavoriteUserListEmpty } from "src/components/templates/ProfileTemplate/molecules/FavoriteUserListEmpty";
import { FavoriteUserListItem } from "src/components/templates/ProfileTemplate/molecules/FavoriteUserListItem";

type Props = {
  users: Profile[];
};
export const FavoriteUserList: React.FC<Props> = (props) => {
  const { users } = props;

  if (users.length > 0) {
    return (
      <>
        {users.map((user) => {
          return (
            <FavoriteUserListItem
              key={user.id}
              name={user.name}
              ProfileImageUri={user.image}
            />
          );
        })}
      </>
    );
  } else {
    return <FavoriteUserListEmpty />;
  }
};
