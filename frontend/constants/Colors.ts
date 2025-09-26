/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#A87676';
const tintColorDark = '#1B3C53';

export const Colors = {
  light: {
    text: '#A87676',
    background: '#FFD0D0',
    card: '#E1ACAC',
    accent: '#A87676',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    button: '#A87676',
    modeButton: '#E1ACAC',
    modeButtonActive: '#A87676',
  },
  dark: {
    text: tintColorDark,
    background: '#234C6A',
    card: '#456882',
    accent: '#ECEDEE',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    button: '#1B3C53',
    modeButton: '#1C6EA4',
    modeButtonActive: '#33A1E0',
  },
};
