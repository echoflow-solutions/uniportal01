'use client'

import Link from 'next/link'
import { Shield, Github, ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo and Info */}
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold text-slate-700">UniPortal</span>
            <span className="text-slate-400">|</span>
            <span className="text-sm text-slate-500">Academic Integrity Platform</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <Link href="/about" className="text-slate-500 hover:text-slate-700 transition-colors">
              About
            </Link>
            <Link href="/privacy" className="text-slate-500 hover:text-slate-700 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-slate-500 hover:text-slate-700 transition-colors">
              Terms
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">Source</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Copyright and Demo Notice */}
        <div className="mt-6 pt-4 border-t text-center">
          <p className="text-sm text-slate-500">
            ICT6001 Applied Project - Trimester 3, 2025
          </p>
          <p className="text-xs text-slate-400 mt-1">
            &copy; {new Date().getFullYear()} UniPortal. Demo Application - No Real Data.
          </p>
        </div>
      </div>
    </footer>
  )
}
