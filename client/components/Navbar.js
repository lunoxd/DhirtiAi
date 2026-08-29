"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { ShieldAlert, Activity, History, HeartHandshake, Shield, User, LogOut, Menu, X, PlusCircle } from "lucide-react";
import EmergencyModal from "./EmergencyModal";

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Activity, authRequired: true },
    { href: "/check-in", label: "Check In", icon: PlusCircle, authRequired: true },
    { href: "/history", label: "History", icon: History, authRequired: true },
    { href: "/support", label: "Support & Helplines", icon: HeartHandshake, authRequired: false },
    { href: "/privacy", label: "Privacy", icon: Shield, authRequired: false }
  ];

  return (
    <>
      <nav style={{
        backgroundColor: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border-subtle)",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div className="container" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px"
        }}>
          {/* Brand Logo */}
          <Link href={isAuthenticated ? "/dashboard" : "/"} style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "18px",
            fontWeight: 800,
            letterSpacing: "0.06em",
            color: "#ffffff"
          }}>
            <div style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              backgroundColor: "var(--brand-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: 900
            }}>
              D
            </div>
            DHRITI
          </Link>

          {/* Desktop Nav Links */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }} className="desktop-only">
            {navLinks
              .filter(link => !link.authRequired || isAuthenticated)
              .map(link => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 14px",
                      borderRadius: "var(--radius-md)",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: isActive ? "#ffffff" : "var(--text-muted)",
                      backgroundColor: isActive ? "var(--bg-primary)" : "transparent",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <Icon size={16} color={isActive ? "var(--brand-primary)" : "var(--text-muted)"} />
                    {link.label}
                  </Link>
                );
              })}
          </div>

          {/* Right Action Area */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Urgent Crisis Quick Action */}
            <button
              onClick={() => setEmergencyOpen(true)}
              className="btn btn-danger btn-sm"
              title="Immediate Crisis Support"
              style={{ padding: "6px 12px", fontSize: "12px", fontWeight: 700 }}
            >
              <ShieldAlert size={14} />
              <span>24/7 Helpline</span>
            </button>

            {isAuthenticated ? (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }} className="desktop-only">
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  backgroundColor: "var(--bg-tertiary)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-card)",
                  fontSize: "13px",
                  color: "var(--text-normal)"
                }}>
                  <User size={14} color="var(--brand-primary)" />
                  <span>{user?.name || "Survivor"}</span>
                </div>
                <button
                  onClick={logout}
                  className="btn btn-secondary btn-sm"
                  title="Sign Out"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }} className="desktop-only">
                <Link href="/login" className="btn btn-secondary btn-sm">Log In</Link>
                <Link href="/register" className="btn btn-primary btn-sm">Get Started</Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-only"
              style={{
                color: "var(--text-normal)",
                padding: "6px",
                display: "none"
              }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div style={{
            backgroundColor: "var(--bg-primary)",
            borderBottom: "1px solid var(--border-subtle)",
            padding: "16px"
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {navLinks
                .filter(link => !link.authRequired || isAuthenticated)
                .map(link => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "12px 14px",
                        borderRadius: "var(--radius-md)",
                        fontSize: "15px",
                        fontWeight: 500,
                        color: isActive ? "#ffffff" : "var(--text-normal)",
                        backgroundColor: isActive ? "var(--bg-secondary)" : "transparent"
                      }}
                    >
                      <Icon size={18} color={isActive ? "var(--brand-primary)" : "var(--text-muted)"} />
                      {link.label}
                    </Link>
                  );
                })}

              <div style={{ height: "1px", backgroundColor: "var(--border-subtle)", margin: "8px 0" }} />

              {isAuthenticated ? (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
                  <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>{user?.name}</span>
                  <button onClick={logout} className="btn btn-secondary btn-sm">
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", gap: "10px" }}>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary btn-block">Log In</Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-block">Register</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Emergency Helpline Modal */}
      {emergencyOpen && (
        <EmergencyModal onClose={() => setEmergencyOpen(false)} />
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }
          .mobile-only {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}
