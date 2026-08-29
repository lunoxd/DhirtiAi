"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  ShieldAlert,
  Activity,
  History,
  HeartHandshake,
  Shield,
  User,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Stethoscope,
  LayoutDashboard
} from "lucide-react";
import EmergencyModal from "./EmergencyModal";

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, isDoctor, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  let navLinks = [];

  if (isAdmin) {
    navLinks = [
      { href: "/admin", label: "Admin Center", icon: LayoutDashboard },
      { href: "/doctor", label: "Doctor Triage", icon: Stethoscope },
      { href: "/dashboard", label: "User View", icon: Activity },
      { href: "/support", label: "Helplines", icon: HeartHandshake },
      { href: "/privacy", label: "Privacy", icon: Shield }
    ];
  } else if (isDoctor) {
    navLinks = [
      { href: "/doctor", label: "Distress Triage Queue", icon: Stethoscope },
      { href: "/dashboard", label: "Self Check-in", icon: PlusCircle },
      { href: "/support", label: "Helpline Directory", icon: HeartHandshake },
      { href: "/privacy", label: "Privacy", icon: Shield }
    ];
  } else {
    navLinks = [
      { href: "/dashboard", label: "Dashboard", icon: Activity, authRequired: true },
      { href: "/check-in", label: "Check In", icon: PlusCircle, authRequired: true },
      { href: "/history", label: "History", icon: History, authRequired: true },
      { href: "/support", label: "Indian Helplines", icon: HeartHandshake, authRequired: false },
      { href: "/privacy", label: "Privacy", icon: Shield, authRequired: false }
    ];
  }

  const getRoleBadge = () => {
    if (isAdmin) {
      return (
        <span style={{
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          color: "#d97706",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          fontSize: "10px",
          fontWeight: 700,
          padding: "2px 8px",
          borderRadius: "var(--rounded-pill)",
          textTransform: "uppercase"
        }}>
          Admin
        </span>
      );
    }
    if (isDoctor) {
      return (
        <span style={{
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          color: "#2563eb",
          border: "1px solid rgba(59, 130, 246, 0.3)",
          fontSize: "10px",
          fontWeight: 700,
          padding: "2px 8px",
          borderRadius: "var(--rounded-pill)",
          textTransform: "uppercase"
        }}>
          Doctor / Responder
        </span>
      );
    }
    return null;
  };

  return (
    <>
      <nav style={{
        backgroundColor: "var(--canvas)",
        borderBottom: "1px solid var(--hairline)",
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
          {/* Brand Wordmark */}
          <Link href={isAdmin ? "/admin" : isDoctor ? "/doctor" : (isAuthenticated ? "/dashboard" : "/")} style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "18px",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--ink)"
          }}>
            <div style={{
              width: "28px",
              height: "28px",
              borderRadius: "var(--rounded-full)",
              backgroundColor: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: 700,
              color: "#ffffff"
            }}>
              d
            </div>
            <span>Dhriti</span>
          </Link>

          {/* Center Navigation Links */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "2px"
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
                      borderRadius: "var(--rounded-md)",
                      fontSize: "14px",
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? "var(--ink)" : "var(--text-muted)",
                      backgroundColor: isActive ? "var(--surface-soft)" : "transparent",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <Icon size={15} color={isActive ? "var(--ink)" : "var(--text-muted)"} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
          </div>

          {/* Right Action Cluster */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Urgent Crisis Quick Action */}
            <button
              onClick={() => setEmergencyOpen(true)}
              className="btn btn-secondary btn-sm"
              style={{
                borderColor: "rgba(239, 68, 68, 0.3)",
                color: "var(--error)",
                fontSize: "13px",
                fontWeight: 600,
                backgroundColor: "rgba(239, 68, 68, 0.04)"
              }}
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
                  backgroundColor: "var(--surface-card)",
                  borderRadius: "var(--rounded-md)",
                  border: "1px solid var(--hairline)",
                  fontSize: "13px",
                  color: "var(--ink)"
                }}>
                  <User size={14} color="var(--text-muted)" />
                  <span style={{ fontWeight: 600 }}>{user?.name || "User"}</span>
                  {getRoleBadge()}
                </div>
                <button
                  onClick={logout}
                  className="btn btn-secondary btn-sm"
                  title="Sign Out"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }} className="desktop-only">
                <Link href="/login" className="btn btn-secondary btn-sm">Sign in</Link>
                <Link href="/register" className="btn btn-primary btn-sm">Sign up free</Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-only"
              style={{
                color: "var(--ink)",
                padding: "6px",
                display: "none"
              }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div style={{
            backgroundColor: "var(--canvas)",
            borderBottom: "1px solid var(--hairline)",
            padding: "16px"
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
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
                        padding: "10px 14px",
                        borderRadius: "var(--rounded-md)",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: isActive ? "var(--ink)" : "var(--text-muted)",
                        backgroundColor: isActive ? "var(--surface-soft)" : "transparent"
                      }}
                    >
                      <Icon size={16} color={isActive ? "var(--ink)" : "var(--text-muted)"} />
                      {link.label}
                    </Link>
                  );
                })}

              <div style={{ height: "1px", backgroundColor: "var(--hairline)", margin: "8px 0" }} />

              {isAuthenticated ? (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink)" }}>{user?.name}</span>
                    {getRoleBadge()}
                  </div>
                  <button onClick={logout} className="btn btn-secondary btn-sm">
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", gap: "8px" }}>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary btn-block btn-sm">Sign in</Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-block btn-sm">Sign up free</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

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
