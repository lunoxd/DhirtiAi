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
  LayoutDashboard,
  Users,
  Settings
} from "lucide-react";
import EmergencyModal from "./EmergencyModal";

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, isDoctor, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  // Dynamic Navigation based on Role
  let navLinks = [];

  if (isAdmin) {
    navLinks = [
      { href: "/admin", label: "Admin Center", icon: LayoutDashboard },
      { href: "/doctor", label: "Doctor Triage", icon: Stethoscope },
      { href: "/dashboard", label: "User View", icon: Activity },
      { href: "/support", label: "Indian Helplines", icon: HeartHandshake },
      { href: "/privacy", label: "Privacy", icon: Shield }
    ];
  } else if (isDoctor) {
    navLinks = [
      { href: "/doctor", label: "Distress Triage Queue", icon: Stethoscope },
      { href: "/dashboard", label: "Self Check-in", icon: PlusCircle },
      { href: "/support", label: "Helpline Resources", icon: HeartHandshake },
      { href: "/privacy", label: "Privacy", icon: Shield }
    ];
  } else {
    // Normal User / Survivor
    navLinks = [
      { href: "/dashboard", label: "Dashboard", icon: Activity, authRequired: true },
      { href: "/check-in", label: "Check In", icon: PlusCircle, authRequired: true },
      { href: "/history", label: "History", icon: History, authRequired: true },
      { href: "/support", label: "Support & Helplines", icon: HeartHandshake, authRequired: false },
      { href: "/privacy", label: "Privacy", icon: Shield, authRequired: false }
    ];
  }

  const getRoleBadge = () => {
    if (isAdmin) {
      return (
        <span style={{
          backgroundColor: "rgba(240, 178, 50, 0.2)",
          color: "var(--status-elevated)",
          border: "1px solid var(--status-elevated)",
          fontSize: "10px",
          fontWeight: 800,
          padding: "2px 6px",
          borderRadius: "4px",
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
          border: "1px solid var(--brand-primary)",
          fontSize: "10px",
          fontWeight: 800,
          padding: "2px 6px",
          borderRadius: "4px",
          textTransform: "uppercase"
        }}>
          Doctor / Helpline
        </span>
      );
    }
    return null;
  };

  return (
    <>
      <nav style={{
        backgroundColor: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border-subtle)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 1px 2px rgba(0,0,0,0.2)"
      }}>
        <div className="container" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "60px"
        }}>
          {/* Brand Logo */}
          <Link href={isAdmin ? "/admin" : isDoctor ? "/doctor" : (isAuthenticated ? "/dashboard" : "/")} style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "17px",
            fontWeight: 800,
            letterSpacing: "0.04em",
            color: "#ffffff"
          }}>
            <div style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              backgroundColor: "var(--brand-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "15px",
              fontWeight: 900,
              color: "#ffffff"
            }}>
              D
            </div>
            <span>DHRITI</span>
          </Link>

          {/* Desktop Nav Links */}
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
                      padding: "8px 12px",
                      borderRadius: "var(--radius-md)",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: isActive ? "#ffffff" : "var(--text-muted)",
                      backgroundColor: isActive ? "var(--bg-active)" : "transparent",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <Icon size={15} color={isActive ? "var(--brand-primary)" : "var(--text-muted)"} />
                    {link.label}
                  </Link>
                );
              })}
          </div>

          {/* Right Action Area */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Urgent Crisis Quick Action (Tele-MANAS & 112) */}
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
                  color: "var(--text-header)"
                }}>
                  <User size={14} color="var(--brand-primary)" />
                  <span>{user?.name || "User"}</span>
                  {getRoleBadge()}
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
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div style={{
            backgroundColor: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border-subtle)",
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
                        padding: "10px 12px",
                        borderRadius: "var(--radius-md)",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: isActive ? "#ffffff" : "var(--text-normal)",
                        backgroundColor: isActive ? "var(--bg-active)" : "transparent"
                      }}
                    >
                      <Icon size={16} color={isActive ? "var(--brand-primary)" : "var(--text-muted)"} />
                      {link.label}
                    </Link>
                  );
                })}

              <div style={{ height: "1px", backgroundColor: "var(--border-subtle)", margin: "8px 0" }} />

              {isAuthenticated ? (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{user?.name}</span>
                    {getRoleBadge()}
                  </div>
                  <button onClick={logout} className="btn btn-secondary btn-sm">
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", gap: "8px" }}>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary btn-block btn-sm">Log In</Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-block btn-sm">Register</Link>
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
