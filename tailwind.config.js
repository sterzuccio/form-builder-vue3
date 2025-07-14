module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  safelist: [
    // Dynamic color classes for FormBuilder component
    // Generate explicit class names for all supported colors

    // Focus ring colors
    'focus:ring-slate-500', 'focus:ring-gray-500', 'focus:ring-zinc-500', 'focus:ring-neutral-500', 'focus:ring-stone-500',
    'focus:ring-red-500', 'focus:ring-orange-500', 'focus:ring-amber-500', 'focus:ring-yellow-500', 'focus:ring-lime-500',
    'focus:ring-green-500', 'focus:ring-emerald-500', 'focus:ring-teal-500', 'focus:ring-cyan-500', 'focus:ring-sky-500',
    'focus:ring-blue-500', 'focus:ring-indigo-500', 'focus:ring-violet-500', 'focus:ring-purple-500', 'focus:ring-fuchsia-500',
    'focus:ring-pink-500', 'focus:ring-rose-500',

    // Focus border colors
    'focus:border-slate-500', 'focus:border-gray-500', 'focus:border-zinc-500', 'focus:border-neutral-500', 'focus:border-stone-500',
    'focus:border-red-500', 'focus:border-orange-500', 'focus:border-amber-500', 'focus:border-yellow-500', 'focus:border-lime-500',
    'focus:border-green-500', 'focus:border-emerald-500', 'focus:border-teal-500', 'focus:border-cyan-500', 'focus:border-sky-500',
    'focus:border-blue-500', 'focus:border-indigo-500', 'focus:border-violet-500', 'focus:border-purple-500', 'focus:border-fuchsia-500',
    'focus:border-pink-500', 'focus:border-rose-500',

    // Text colors - 500
    'text-slate-500', 'text-gray-500', 'text-zinc-500', 'text-neutral-500', 'text-stone-500',
    'text-red-500', 'text-orange-500', 'text-amber-500', 'text-yellow-500', 'text-lime-500',
    'text-green-500', 'text-emerald-500', 'text-teal-500', 'text-cyan-500', 'text-sky-500',
    'text-blue-500', 'text-indigo-500', 'text-violet-500', 'text-purple-500', 'text-fuchsia-500',
    'text-pink-500', 'text-rose-500',

    // Text colors - 600
    'text-slate-600', 'text-gray-600', 'text-zinc-600', 'text-neutral-600', 'text-stone-600',
    'text-red-600', 'text-orange-600', 'text-amber-600', 'text-yellow-600', 'text-lime-600',
    'text-green-600', 'text-emerald-600', 'text-teal-600', 'text-cyan-600', 'text-sky-600',
    'text-blue-600', 'text-indigo-600', 'text-violet-600', 'text-purple-600', 'text-fuchsia-600',
    'text-pink-600', 'text-rose-600',

    // Background colors - 600
    'bg-slate-600', 'bg-gray-600', 'bg-zinc-600', 'bg-neutral-600', 'bg-stone-600',
    'bg-red-600', 'bg-orange-600', 'bg-amber-600', 'bg-yellow-600', 'bg-lime-600',
    'bg-green-600', 'bg-emerald-600', 'bg-teal-600', 'bg-cyan-600', 'bg-sky-600',
    'bg-blue-600', 'bg-indigo-600', 'bg-violet-600', 'bg-purple-600', 'bg-fuchsia-600',
    'bg-pink-600', 'bg-rose-600',

    // Background colors - 700
    'bg-slate-700', 'bg-gray-700', 'bg-zinc-700', 'bg-neutral-700', 'bg-stone-700',
    'bg-red-700', 'bg-orange-700', 'bg-amber-700', 'bg-yellow-700', 'bg-lime-700',
    'bg-green-700', 'bg-emerald-700', 'bg-teal-700', 'bg-cyan-700', 'bg-sky-700',
    'bg-blue-700', 'bg-indigo-700', 'bg-violet-700', 'bg-purple-700', 'bg-fuchsia-700',
    'bg-pink-700', 'bg-rose-700',

    // Hover background colors - 700
    'hover:bg-slate-700', 'hover:bg-gray-700', 'hover:bg-zinc-700', 'hover:bg-neutral-700', 'hover:bg-stone-700',
    'hover:bg-red-700', 'hover:bg-orange-700', 'hover:bg-amber-700', 'hover:bg-yellow-700', 'hover:bg-lime-700',
    'hover:bg-green-700', 'hover:bg-emerald-700', 'hover:bg-teal-700', 'hover:bg-cyan-700', 'hover:bg-sky-700',
    'hover:bg-blue-700', 'hover:bg-indigo-700', 'hover:bg-violet-700', 'hover:bg-purple-700', 'hover:bg-fuchsia-700',
    'hover:bg-pink-700', 'hover:bg-rose-700',

    // Patterns for custom colors - these will match dynamically generated custom color classes
    {
      pattern: /^(text|bg|border)-([\w-]+)-(50|100|200|300|400|500|600|700|800|900|950)$/,
    },
    {
      pattern: /^(focus|hover):(ring|border|bg|text)-([\w-]+)-(50|100|200|300|400|500|600|700|800|900|950)$/,
    }
  ],
  theme: {
    extend: {
      // Custom colors will be dynamically added here by the FormBuilder component
      colors: {}
    },
  },
  plugins: [],
}
