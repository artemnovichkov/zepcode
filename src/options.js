export default function getOptions(context) {
  return {
    useColorNames: context.getOption('use_color_names'),
    useCustomColorInitializer: context.getOption(
      'use_custom_color_initializer'
    ),
  };
}
