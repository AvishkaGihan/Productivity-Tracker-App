import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
}

interface ConfettiAnimationProps {
  visible: boolean;
  onComplete?: () => void;
  duration?: number;
}

export const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({
  visible,
  onComplete,
  duration = 3000,
}) => {
  const [confetti, setConfetti] = React.useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (visible) {
      const colors = [
        "#FF6B6B",
        "#4ECDC4",
        "#45B7D1",
        "#FFA07A",
        "#98D8C8",
        "#F7DC6F",
      ];
      const pieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * SCREEN_WIDTH,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 500,
      }));
      setConfetti(pieces);

      const timer = setTimeout(() => {
        setConfetti([]);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onComplete]);

  if (!visible || confetti.length === 0) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {confetti.map((piece) => (
        <ConfettiPiece
          key={piece.id}
          x={piece.x}
          color={piece.color}
          delay={piece.delay}
        />
      ))}
    </View>
  );
};

interface ConfettiPieceComponentProps {
  x: number;
  color: string;
  delay: number;
}

const ConfettiPiece: React.FC<ConfettiPieceComponentProps> = ({
  x,
  color,
  delay,
}) => {
  const fallAnim = useRef(new Animated.Value(-20)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const swingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fallAnim, {
          toValue: SCREEN_HEIGHT + 20,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          })
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(swingAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(swingAnim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    }, delay);
  }, [fallAnim, rotateAnim, swingAnim, delay]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const swing = swingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 20],
  });

  return (
    <Animated.View
      style={[
        styles.confettiPiece,
        {
          backgroundColor: color,
          left: x,
          transform: [
            { translateY: fallAnim },
            { translateX: swing },
            { rotate },
          ],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  confettiPiece: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});
