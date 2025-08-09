export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 text-center p-6 mt-10">
      <p>© {new Date().getFullYear()} Netflix Clone by Festus. All rights reserved.</p>
      <p className="mt-2">Built with Next.js, TypeScript, TailwindCSS, and Zustand.</p>
    </footer>
  );
}
