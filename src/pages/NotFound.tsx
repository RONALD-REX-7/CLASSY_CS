import { Background } from "@/components/background";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex min-h-screen flex-col"
    >
      <Background />
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="glass w-full max-w-md rounded-3xl p-10 text-center"
        >
          <p className="font-display text-7xl font-extrabold tracking-tight">
            <span className="text-gradient">404</span>
          </p>
          <h1 className="mt-4 font-display text-2xl font-bold tracking-tight">
            Page not found
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            This page doesn't exist — but your GPA calculator is still here,
            ready when you are.
          </p>
          <Button asChild className="btn-grad mt-6 rounded-full border-0 px-6 text-white">
            <Link to="/calculator">
              <ArrowLeft className="size-4" />
              Back to the calculator
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
