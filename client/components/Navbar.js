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
      { href: "/admin", label: "Admin", icon: LayoutDashboard },
      { href: "/doctor", label: "Doctor Queue", icon: Stethoscope },
      { href: "/dashboard", label: "User View", icon: Activity },
      { href: "/support", label: "Helplines", icon: HeartHandshake }
    ];
  } else if (isDoctor) {
    navLinks = [
      { href: "/doctor", label: "Distress Queue", icon: Stethoscope },
      { href: "/dashboard", label: "Check-in", icon: PlusCircle },
      { href: "/support", label: "Helplines", icon: HeartHandshake }
    ];
  } else {
    navLinks = [
      { href: "/dashboard", label: "Dashboard", icon: Activity, authRequired: true },
      { href: "/check-in", label: "Check In", icon: PlusCircle, authRequired: true },
      { href: "/history", label: "History", icon: History, authRequired: true },
      { href: "/support", label: "Helplines", icon: HeartHandshake, authRequired: false }
    ];
  }

  const getRoleBadge = () => {
    if (isAdmin) {
      return (
        <span style={{
          backgroundColor: "rgba(218, 59, 37, 0.2)",
          color: "var(--primary)",
          fontSize: "10px",
          fontWeight: 700,
          padding: "2px 6px",
          borderRadius: "var(--rounded-pill)"
        }}>
          Admin
        </span>
      );
    }
    if (isDoctor) {
      return (
        <span style={{
          backgroundColor: "rgba(35, 165, 90, 0.2)",
          color: "var(--status-stable)",
          fontSize: "10px",
          fontWeight: 700,
          padding: "2px 6px",
          borderRadius: "var(--rounded-pill)"
        }}>
          Doctor
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
          height: "60px"
        }}>
          {/* Brand Logo */}
          <Link href={isAdmin ? "/admin" : isDoctor ? "/doctor" : (isAuthenticated ? "/dashboard" : "/")} style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "18px",
            fontWeight: 800,
            color: "#ffffff"
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
              fontWeight: 800,
              color: "#ffffff"
            }}>
              d
            </div>
            <span>Dhriti</span>
          </Link>

          {/* Navigation Links */}
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
                      padding: "6px 12px",
                      borderRadius: "var(--rounded-md)",
                      fontSize: "14px",
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "#ffffff" : "var(--text-muted)",
                      backgroundColor: isActive ? "var(--primary)" : "transparent",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <Icon size={15} color={isActive ? "#ffffff" : "var(--text-muted)"} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => setEmergencyOpen(true)}
              className="btn btn-danger btn-sm"
              style={{ fontSize: "12px", fontWeight: 700, padding: "6px 10px" }}
            >
              <ShieldAlert size={14} />
              <span>24/7 Helpline</span>
            </button>

            {isAuthenticated ? (
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }} className="desktop-only">
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  backgroundColor: "var(--surface-soft)",
                  borderRadius: "var(--rounded-md)",
                  border: "1px solid var(--hairline)",
                  fontSize: "13px",
                  color: "#ffffff"
                }}>
                  <User size={13} color="var(--primary)" />
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
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }} className="desktop-only">
                <Link href="/login" className="btn btn-secondary btn-sm">Sign in</Link>
                <Link href="/register" className="btn btn-primary btn-sm">Sign up</Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-only"
              style={{ color: "#ffffff", padding: "4px", display: "none" }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div style={{
            backgroundColor: "#1e1f22",
            borderBottom: "1px solid var(--hairline)",
            padding: "12px 16px"
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
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
                        gap: "8px",
                        padding: "8px 12px",
                        borderRadius: "var(--rounded-md)",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: isActive ? "#ffffff" : "var(--text-muted)",
                        backgroundColor: isActive ? "var(--primary)" : "transparent"
                      }}
                    >
                      <Icon size={16} color={isActive ? "#ffffff" : "var(--text-muted)"} />
                      {link.label}
                    </Link>
                  );
                })}

              <div style={{ height: "1px", backgroundColor: "var(--hairline)", margin: "6px 0" }} />

              {isAuthenticated ? (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#ffffff" }}>{user?.name}</span>
                  <button onClick={logout} className="btn btn-secondary btn-sm">
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", gap: "8px" }}>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary btn-block btn-sm">Sign in</Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-block btn-sm">Sign up</Link>
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
          .desktop-only { display: none !important; }
          .mobile-only { display: block !important; }
        }
      `}</style>
    </>
  );
}
