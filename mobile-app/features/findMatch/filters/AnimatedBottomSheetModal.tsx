import { ReactNode, useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

type AnimatedBottomSheetModalProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  sheetStyle?: StyleProp<ViewStyle>;
};

export const AnimatedBottomSheetModal = ({
  visible,
  onClose,
  children,
  sheetStyle,
}: AnimatedBottomSheetModalProps) => {
  const translateY = useRef(new Animated.Value(420)).current;

  useEffect(() => {
    if (!visible) {
      translateY.setValue(420);
      return;
    }

    Animated.timing(translateY, {
      toValue: 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [visible, translateY]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropArea} onPress={onClose} />

        <Animated.View
          style={[
            styles.sheetBase,
            sheetStyle,
            { transform: [{ translateY }] },
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  backdropArea: {
    flex: 1,
  },
  sheetBase: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
});
