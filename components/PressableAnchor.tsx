/* A <Pressable> that works like an HTML <a>
 */
import React, {ReactNode} from 'react';
import {Linking, Pressable} from 'react-native';

const DynamicStyles = {
  listItemPressableLink: ({pressed}: {pressed: boolean}) => {
    // FIXME: 'gray' is not the same color as the pressed highlight for a <Text onpress=...>
    return pressed ? {backgroundColor: 'gray'} : {};
  },
};

type PressableAnchorParams = {
  href: string;
  children: ReactNode;
};
const PressableAnchor: React.FC<PressableAnchorParams> = ({href, children}) => {
  return (
    <Pressable
      style={DynamicStyles.listItemPressableLink}
      onPress={() => Linking.openURL(href)}>
      {children}
    </Pressable>
  );
};

export default PressableAnchor;
