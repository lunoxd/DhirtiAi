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
          backgroundColor: "rgba(240, 178, 50, 0.2)",
          color: "var(--status-elevated)",
          border: "1px solid rgba(240, 178, 50, 0.4)",
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
          backgroundColor: "rgba(88, 101, 242, 0.2)",
          color: "var(--brand-primary)",
          border: "1px solid rgba(88, 101, 242, 0.4)",
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
        backgroundColor: "#1e1f22",
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
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "#ffffff"
          }}>
            <div style={{
              width: "30px",
              height: "30px",
              borderRadius: "var(--rounded-full)",
              backgroundColor: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: 800,
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
            gap: "4px"
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
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "#ffffff" : "var(--text-muted)",
                      backgroundColor: isActive ? "#35373c" : "transparent",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <Icon size={16} color={isActive ? "#ffffff" : "var(--text-muted)"} />
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
                borderColor: "rgba(242, 63, 67, 0.4)",
                color: "var(--error)",
                fontSize: "13px",
                fontWeight: 700,
                backgroundColor: "rgba(242, 63, 67, 0.1)"
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
                  backgroundColor: "var(--surface-soft)",
                  borderRadius: "var(--rounded-md)",
                  border: "1px solid var(--hairline)",
                  fontSize: "13px",
                  color: "#ffffff"
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
                color: "#ffffff",
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
            backgroundColor: "#1e1f22",
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
                        color: isActive ? "#ffffff" : "var(--text-muted)",
                        backgroundColor: isActive ? "#35373c" : "transparent"
                      }}
                    >
                      <Icon size={16} color={isActive ? "#ffffff" : "var(--text-muted)"} />
                      {link.label}
                    </Link>
                  );
                })}

              <div style={{ height: "1px", backgroundColor: "var(--hairline)", margin: "8px 0" }} />

              {isAuthenticated ? (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#ffffff" }}>{user?.name}</span>
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
