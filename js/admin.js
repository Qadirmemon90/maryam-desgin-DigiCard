/* ==========================================================================
   MARYAM'S DESGINS — EXECUTIVE ADMIN DASHBOARD & CONTROLLER (ADMIN.JS)
   Modern Minimalist Digital Identity Experience
   Complete Multi-Brand Management, Real-time Visitor Analytics,
   maryamsdesign.com Dynamic Sync Engine & QR Code Studio
   ========================================================================== */

const DEFAULT_PROFILE = {
  brandName: "Maryam's Desgins",
  tagline: "Luxury Pret • Festive Edit • Bespoke Couture",
  username: "maryamsdesgins",
  logoUrl: "assets/maryam_logo_refinement.avif",
  phone: "+92 300 1234567",
  whatsapp: "https://wa.me/923001234567",
  email: "contact@maryamsdesgins.com",
  instagram: "https://instagram.com/maryamsdesgins",
  facebook: "https://facebook.com/maryamsdesgins",
  tiktok: "https://tiktok.com/@maryamsdesgins",
  pinterest: "https://pinterest.com/maryamsdesgins",
  website: "https://maryamsdesign.com",
  address: "Luxury Fashion Avenue, Boutique Studio, Lahore / Karachi",
  hours: "Mon - Sat: 11:00 AM - 9:00 PM",
  bio: "Artisanal Pret, Handcrafted Formals & Bespoke Bridal Couture created with meticulous hand embellishments and pure luxury fabrics. Designed for timeless elegance and unforgettable festive occasions.",
  themeBg: "#FFFFFF",
  pageBg: "#FAF7F2",
  buttonBg: "#FFFFFF",
  textColor: "#2A201A",
  accentColor: "#B6713F",
  fontFamily: "playfair",
  qrFgColor: "#2A201A",
  qrBgColor: "#FFFFFF",
  qrType: "url",
  qrEcc: "M",
  qrCenterLogo: true
};

const DEFAULT_LINKS = [];

const DEMO_LINKS = [
  {
    title: "Luxury Pret Collection",
    url: "#",
    image: "assets/maryam_logo_refinement.avif",
    icon: "🛍️",
    badge: "New Arrival",
    active: true,
    featured: true,
    order: 1,
    description: "Handcrafted luxury ready-to-wear silhouettes designed with pure breathable fabrics and fine artisanal threadwork."
  },
  {
    title: "Unstitched Festive Lawn Edit",
    url: "#",
    image: "assets/maryam_logo_refinement.avif",
    icon: "🌸",
    badge: "Festive Edit",
    active: true,
    featured: false,
    order: 2,
    description: "Delicate digital florals, schiffli embroidery, and pure silk chiffon dupattas tailored for joyous celebrations."
  },
  {
    title: "Bespoke Bridal & Formal Couture",
    url: "#",
    image: "assets/maryam_logo_refinement.avif",
    icon: "✨",
    badge: "Bespoke",
    active: true,
    featured: false,
    order: 3,
    description: "Made-to-measure heirlooms featuring opulent zardozi, tilla, and gotta embellishments for the modern bride."
  },
  {
    title: "Ready To Wear | Daily Luxury",
    url: "#",
    image: "assets/maryam_logo_refinement.avif",
    icon: "👗",
    badge: "Trending",
    active: true,
    featured: false,
    order: 4,
    description: "Effortless casual chic tunics and co-ord sets designed for polished everyday elegance and all-day comfort."
  }
];

(function () {
  if (typeof firebase !== "undefined" && window.firebaseConfig) {
    if (!firebase.apps.length) {
      firebase.initializeApp(window.firebaseConfig);
    }
  }

  const auth = (typeof firebase !== "undefined" && firebase.auth) ? firebase.auth() : null;
  const db = (typeof firebase !== "undefined" && firebase.firestore) ? firebase.firestore() : null;

  if (auth) {
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(console.error);
  }

  document.addEventListener("DOMContentLoaded", function () {
    const els = {
      // Screens
      loginScreen: document.getElementById("loginScreen"),
      adminScreen: document.getElementById("adminScreen"),

      // Login form
      email: document.getElementById("email"),
      password: document.getElementById("password"),
      togglePasswordBtn: document.getElementById("togglePasswordBtn"),
      loginBtn: document.getElementById("loginBtn"),
      loginBtnText: document.getElementById("loginBtnText"),
      forgotPasswordBtn: document.getElementById("forgotPasswordBtn"),
      logoutBtn: document.getElementById("logoutBtn"),
      loginMsg: document.getElementById("loginMsg"),
      globalMsg: document.getElementById("globalMsg"),

      // Header info
      adminUserText: document.getElementById("adminUserText"),
      adminPanelEyebrow: document.getElementById("adminPanelEyebrow"),
      adminPanelTitle: document.getElementById("adminPanelTitle"),

      // Multi-Brand Controls
      brandSwitcherSelect: document.getElementById("brandSwitcherSelect"),
      activeBrandSlugDisplay: document.getElementById("activeBrandSlugDisplay"),
      copyBrandLinkBtn: document.getElementById("copyBrandLinkBtn"),
      quickNewBrandBtn: document.getElementById("quickNewBrandBtn"),
      makeDefaultBrandBtn: document.getElementById("makeDefaultBrandBtn"),
      topbarSyncBtn: document.getElementById("topbarSyncBtn"),
      viewLiveCardLink: document.getElementById("viewLiveCardLink"),

      // Brand Manager Panel
      openCreateBrandModalBtn: document.getElementById("openCreateBrandModalBtn"),
      newBrandFormCard: document.getElementById("newBrandFormCard"),
      newBrandNameInput: document.getElementById("newBrandNameInput"),
      newBrandSlugInput: document.getElementById("newBrandSlugInput"),
      newBrandTaglineInput: document.getElementById("newBrandTaglineInput"),
      newBrandPhoneInput: document.getElementById("newBrandPhoneInput"),
      saveNewBrandBtn: document.getElementById("saveNewBrandBtn"),
      cancelNewBrandBtn: document.getElementById("cancelNewBrandBtn"),
      brandsListContainer: document.getElementById("brandsListContainer"),

      // Collections & Profile Controls
      saveProfileBtn: document.getElementById("saveProfileBtn"),
      addLinkBtn: document.getElementById("addLinkBtn"),
      seedBtn: document.getElementById("seedBtn"),
      profileForm: document.getElementById("profileForm"),
      logoUrlInput: document.getElementById("logoUrlInput"),
      profileLogoFile: document.getElementById("profileLogoFile"),
      uploadProfileLogoBtn: document.getElementById("uploadProfileLogoBtn"),
      cloudinaryStatus: document.getElementById("cloudinaryStatus"),
      cloudinaryHelp: document.getElementById("cloudinaryHelp"),
      draftArea: document.getElementById("draftArea"),
      linksAdmin: document.getElementById("linksAdmin"),

      // Analytics Dashboard Elements
      kpiTotalViews: document.getElementById("kpiTotalViews"),
      kpiUniqueVisitors: document.getElementById("kpiUniqueVisitors"),
      kpiQrScans: document.getElementById("kpiQrScans"),
      kpiWaInquiries: document.getElementById("kpiWaInquiries"),
      kpiVcardSaved: document.getElementById("kpiVcardSaved"),
      chartBarsGroup: document.getElementById("chartBarsGroup"),
      statWaCount: document.getElementById("statWaCount"),
      statVcardCount: document.getElementById("statVcardCount"),
      statCallCount: document.getElementById("statCallCount"),
      statShareCount: document.getElementById("statShareCount"),
      barWa: document.getElementById("barWa"),
      barVcard: document.getElementById("barVcard"),
      barCall: document.getElementById("barCall"),
      barShare: document.getElementById("barShare"),
      activityStream: document.getElementById("activityStream"),
      refreshAnalyticsBtn: document.getElementById("refreshAnalyticsBtn"),

      // Theme & Dynamic Sync from maryamsdesign.com
      syncMaryamDesignBtn: document.getElementById("syncMaryamDesignBtn"),
      syncSourceUrl: document.getElementById("syncSourceUrl"),
      syncScopeSelect: document.getElementById("syncScopeSelect"),
      themeForm: document.getElementById("themeForm"),
      saveThemeBtn: document.getElementById("saveThemeBtn"),

      // QR Code Studio Elements
      qrTypeSelect: document.getElementById("qrTypeSelect"),
      qrCustomUrlWrap: document.getElementById("qrCustomUrlWrap"),
      qrCustomUrlInput: document.getElementById("qrCustomUrlInput"),
      qrFgColorInput: document.getElementById("qrFgColorInput"),
      qrFgHex: document.getElementById("qrFgHex"),
      qrBgColorInput: document.getElementById("qrBgColorInput"),
      qrBgHex: document.getElementById("qrBgHex"),
      qrSizeSlider: document.getElementById("qrSizeSlider"),
      qrSizeVal: document.getElementById("qrSizeVal"),
      qrMarginSlider: document.getElementById("qrMarginSlider"),
      qrMarginVal: document.getElementById("qrMarginVal"),
      qrEccSelect: document.getElementById("qrEccSelect"),
      qrCenterLogoToggle: document.getElementById("qrCenterLogoToggle"),
      qrStudioPreviewImg: document.getElementById("qrStudioPreviewImg"),
      qrCenterLogoBadge: document.getElementById("qrCenterLogoBadge"),
      saveQrToCardBackBtn: document.getElementById("saveQrToCardBackBtn"),
      downloadQrPngBtn: document.getElementById("downloadQrPngBtn"),
      printCardLayoutBtn: document.getElementById("printCardLayoutBtn"),

      // System & Backups Elements
      exportDataBtn: document.getElementById("exportDataBtn"),
      importDataInput: document.getElementById("importDataInput"),
      resetAnalyticsBtn: document.getElementById("resetAnalyticsBtn")
    };

    // State Variables
    let activeBrandId = "default";
    let availableBrands = [{ id: "default", name: "Maryam's Desgins (Primary)", isPrimary: true }];
    let currentProfileData = { ...DEFAULT_PROFILE };
    let currentLinks = [];
    const expandedCards = new Set();
    let unsubProfile = null;
    let unsubLinks = null;
    let unsubBrands = null;

    const PANEL_META = {
      dashboardSection: { eyebrow: "Card Analytics", title: "Visiting Card Traffic & Analytics", showAdd: false },
      collectionsSection: { eyebrow: "Collections", title: "Manage Boutique Links", showAdd: true },
      profileSection: { eyebrow: "Profile", title: "Brand Identity & Bio", showAdd: false },
      paletteSection: { eyebrow: "Theme & Colors", title: "Luxury Color Palette & Theme", showAdd: false },
      qrSection: { eyebrow: "QR Studio", title: "QR Code Studio & Settings", showAdd: false },
      brandsSection: { eyebrow: "Multi-Brand", title: "Multi-Brand & Profiles Hub", showAdd: false },
      overviewSection: { eyebrow: "Cloudinary", title: "Media Upload Hub", showAdd: false },
      settingsSection: { eyebrow: "System", title: "System, Backups & Data", showAdd: false }
    };

    function escapeHtml(str) {
      return String(str || "").replace(/[&<>"']/g, function (m) {
        return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m];
      });
    }

    function showGlobal(message, isError) {
      if (!els.globalMsg) return;
      els.globalMsg.textContent = message;
      els.globalMsg.className = "mb-4 status-box " + (isError ? "status-error" : "status-info");
      els.globalMsg.classList.remove("hidden");
      els.globalMsg.scrollIntoView({ behavior: "smooth", block: "nearest" });
      setTimeout(function () {
        if (els.globalMsg) els.globalMsg.classList.add("hidden");
      }, 5500);
    }

    function switchPanel(panelId) {
      const panels = Array.from(document.querySelectorAll(".admin-panel"));
      const links = Array.from(document.querySelectorAll("[data-panel-link]"));
      const activeId = PANEL_META[panelId] ? panelId : "dashboardSection";
      const meta = PANEL_META[activeId];

      panels.forEach(function (panel) {
        panel.classList.toggle("is-active", panel.id === activeId);
      });
      links.forEach(function (link) {
        link.classList.toggle("is-active", link.dataset.panelLink === activeId);
      });

      if (els.adminPanelEyebrow) els.adminPanelEyebrow.textContent = meta.eyebrow;
      if (els.adminPanelTitle) els.adminPanelTitle.textContent = meta.title;
      if (els.addLinkBtn) els.addLinkBtn.classList.toggle("hidden", !meta.showAdd);

      if (activeId === "dashboardSection") {
        renderDashboardAnalytics();
      } else if (activeId === "qrSection") {
        updateQrStudioPreview();
      }
    }

    // Build URL for a specific brand
    function getBrandPublicUrl(brandId) {
      const baseUrl = window.location.origin + window.location.pathname.replace("admin.html", "index.html");
      if (!brandId || brandId === "default") {
        return baseUrl;
      }
      return baseUrl + "?brand=" + encodeURIComponent(brandId);
    }

    // ===================================================================
    // 1. VISITOR ANALYTICS & DASHBOARD ENGINE
    // ===================================================================
    function getAnalyticsData(brandId) {
      const storageKey = "md_analytics_" + (brandId || "default");
      let data = {
        totalViews: 0,
        uniqueVisitors: 0,
        qrScans: 0,
        waInquiries: 0,
        callClicks: 0,
        vcardDownloads: 0,
        shareClicks: 0,
        channels: { whatsapp: 0, vcard: 0, call: 0, share: 0 },
        daily: {
          mon: { views: 0, scans: 0 },
          tue: { views: 0, scans: 0 },
          wed: { views: 0, scans: 0 },
          thu: { views: 0, scans: 0 },
          fri: { views: 0, scans: 0 },
          sat: { views: 0, scans: 0 },
          sun: { views: 0, scans: 0 }
        },
        events: []
      };

      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          data.totalViews = Number(parsed.totalViews || 0);
          data.uniqueVisitors = Number(parsed.uniqueVisitors || 0);
          data.qrScans = Number(parsed.qrScans || 0);
          data.waInquiries = Number(parsed.waInquiries || 0);
          data.callClicks = Number(parsed.callClicks || 0);
          data.vcardDownloads = Number(parsed.vcardDownloads || 0);
          data.shareClicks = Number(parsed.shareClicks || 0);
          if (parsed.channels) {
            data.channels.whatsapp = Number(parsed.channels.whatsapp || 0);
            data.channels.vcard = Number(parsed.channels.vcard || 0);
            data.channels.call = Number(parsed.channels.call || 0);
            data.channels.share = Number(parsed.channels.share || 0);
          }
          if (parsed.daily) {
            data.daily = { ...data.daily, ...parsed.daily };
          }
          if (parsed.events && Array.isArray(parsed.events)) {
            data.events = parsed.events.slice(0, 20);
          }
        }
      } catch (e) {
        console.warn("Analytics parse notice:", e);
      }

      return data;
    }

    function renderDashboardAnalytics() {
      const data = getAnalyticsData(activeBrandId);

      if (els.kpiTotalViews) els.kpiTotalViews.textContent = Number(data.totalViews || 0).toLocaleString();
      if (els.kpiUniqueVisitors) els.kpiUniqueVisitors.textContent = Number(data.uniqueVisitors || 0).toLocaleString();
      if (els.kpiQrScans) els.kpiQrScans.textContent = Number(data.qrScans || 0).toLocaleString();
      if (els.kpiWaInquiries) els.kpiWaInquiries.textContent = Number(data.waInquiries || 0).toLocaleString();
      if (els.kpiVcardSaved) els.kpiVcardSaved.textContent = Number(data.vcardDownloads || 0).toLocaleString();

      // Channels Breakdown
      const rawTotal = (data.channels.whatsapp + data.channels.vcard + data.channels.call + data.channels.share) || 0;
      const totalInquiries = rawTotal || 1;
      const waPct = rawTotal > 0 ? Math.round((data.channels.whatsapp / totalInquiries) * 100) : 0;
      const vcardPct = rawTotal > 0 ? Math.round((data.channels.vcard / totalInquiries) * 100) : 0;
      const callPct = rawTotal > 0 ? Math.round((data.channels.call / totalInquiries) * 100) : 0;
      const sharePct = rawTotal > 0 ? Math.max(100 - waPct - vcardPct - callPct, 0) : 0;

      if (els.statWaCount) els.statWaCount.textContent = `${data.channels.whatsapp} (${waPct}%)`;
      if (els.barWa) els.barWa.style.width = waPct + "%";

      if (els.statVcardCount) els.statVcardCount.textContent = `${data.channels.vcard} (${vcardPct}%)`;
      if (els.barVcard) els.barVcard.style.width = vcardPct + "%";

      if (els.statCallCount) els.statCallCount.textContent = `${data.channels.call} (${callPct}%)`;
      if (els.barCall) els.barCall.style.width = callPct + "%";

      if (els.statShareCount) els.statShareCount.textContent = `${data.channels.share} (${sharePct}%)`;
      if (els.barShare) els.barShare.style.width = sharePct + "%";

      const statConv = document.getElementById("statConversionRate");
      if (statConv) {
        const convRate = data.totalViews > 0 ? Math.round((rawTotal / data.totalViews) * 100) : 0;
        statConv.textContent = "Conversion: " + convRate + "%";
      }

      // Render Interactive 7-Day SVG Bar Chart
      if (els.chartBarsGroup) {
        const days = [
          { label: "Mon", views: data.daily.mon.views, scans: data.daily.mon.scans },
          { label: "Tue", views: data.daily.tue.views, scans: data.daily.tue.scans },
          { label: "Wed", views: data.daily.wed.views, scans: data.daily.wed.scans },
          { label: "Thu", views: data.daily.thu.views, scans: data.daily.thu.scans },
          { label: "Fri", views: data.daily.fri.views, scans: data.daily.fri.scans },
          { label: "Sat", views: data.daily.sat.views, scans: data.daily.sat.scans },
          { label: "Today", views: data.daily.sun.views, scans: data.daily.sun.scans }
        ];

        const maxVal = 320;
        const chartHeight = 110;
        const baseY = 150;
        let html = "";

        days.forEach(function (d, i) {
          const x = 50 + (i * 68);
          const viewH = Math.min(Math.round((d.views / maxVal) * chartHeight), chartHeight);
          const scanH = Math.min(Math.round((d.scans / maxVal) * chartHeight), chartHeight);
          const viewY = baseY - viewH;
          const scanY = baseY - scanH;

          html += `
            <g class="chart-bar-group">
              <title>${d.label}: ${d.views} Views, ${d.scans} QR Scans</title>
              <!-- Views Bar -->
              <rect x="${x}" y="${viewY}" width="18" height="${viewH}" rx="4" fill="#B6713F" />
              <!-- Scans Bar -->
              <rect x="${x + 22}" y="${scanY}" width="18" height="${scanH}" rx="4" fill="#2A201A" />
              <!-- Day Label -->
              <text x="${x + 20}" y="170" font-size="11" font-weight="700" fill="#6B7280" text-anchor="middle" font-family="sans-serif">${d.label}</text>
            </g>
          `;
        });

        els.chartBarsGroup.innerHTML = html;
      }

      // Render Real-Time Activity Feed
      if (els.activityStream) {
        if (!data.events || !data.events.length) {
          els.activityStream.innerHTML = '<div class="text-xs text-gray-400 p-4 text-center">No recent activity logged yet.</div>';
        } else {
          els.activityStream.innerHTML = data.events.map(function (ev) {
            let iconSvg = '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
            if (ev.type === "wa_click") {
              iconSvg = '<svg class="w-3.5 h-3.5 text-emerald-700" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.5 0 .2 5.3.2 11.9c0 2.1.6 4.1 1.6 5.9L0 24l6.4-1.7a11.9 11.9 0 0 0 5.7 1.5c6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.2-3.5-8.4Z"/></svg>';
            } else if (ev.type === "qr_scan") {
              iconSvg = '<svg class="w-3.5 h-3.5 text-amber-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>';
            } else if (ev.type === "vcard_download") {
              iconSvg = '<svg class="w-3.5 h-3.5 text-amber-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path></svg>';
            }

            return `
              <div class="activity-item">
                <div class="activity-icon">${iconSvg}</div>
                <div class="activity-desc">
                  <div>${escapeHtml(ev.label || "Visiting card activity")}</div>
                  <div class="activity-time">${escapeHtml(ev.time || "Just now")} &bull; ${escapeHtml(ev.device || "Mobile")}</div>
                </div>
              </div>
            `;
          }).join("");
        }
      }
    }

    if (els.refreshAnalyticsBtn) {
      els.refreshAnalyticsBtn.addEventListener("click", function () {
        renderDashboardAnalytics();
        showGlobal("Live activity and visitor metrics refreshed.", false);
      });
    }

    if (els.resetAnalyticsBtn) {
      els.resetAnalyticsBtn.addEventListener("click", function () {
        if (confirm("Reset all visitor counts and analytics back to zero?")) {
          localStorage.removeItem("md_analytics_" + activeBrandId);
          renderDashboardAnalytics();
          showGlobal("Analytics data reset successfully.", false);
        }
      });
    }

    const resetAllSettingsBtn = document.getElementById("resetAllSettingsBtn");
    if (resetAllSettingsBtn) {
      resetAllSettingsBtn.addEventListener("click", async function () {
        if (!confirm("Are you sure you want to reset all profile, card settings, and Firebase configuration back to clean luxury defaults?")) return;
        try {
          if (db) {
            await db.collection("settings").doc("profile").set(DEFAULT_PROFILE, { merge: false });
            try {
              const linksSnap = await db.collection("links").get();
              const batch = db.batch();
              linksSnap.forEach(function (doc) {
                batch.delete(doc.ref);
              });
              await batch.commit();
            } catch (e) {
              console.warn("Links cleanup note:", e);
            }
          }
          currentProfile = { ...DEFAULT_PROFILE };
          fillProfileForm(DEFAULT_PROFILE);
          fillThemeForm(DEFAULT_PROFILE);
          showGlobal("All card settings and Firebase configuration reset to fresh luxury defaults!", false);
        } catch (err) {
          showGlobal("Reset notice: " + err.message, true);
        }
      });
    }

    // ===================================================================
    // 2. QR CODE STUDIO ENGINE & LIVE PREVIEW
    // ===================================================================
    function getQrCodePayload() {
      const type = els.qrTypeSelect ? els.qrTypeSelect.value : "url";
      const brandUrl = getBrandPublicUrl(activeBrandId);

      if (type === "vcard") {
        const name = currentProfileData.brandName || "Maryam's Desgins";
        const phone = currentProfileData.phone || "+923000000000";
        const email = currentProfileData.email || "contact@maryamsdesign.com";
        const site = currentProfileData.website || "https://maryamsdesign.com";
        return `BEGIN:VCARD\r\nVERSION:3.0\r\nFN:${name}\r\nORG:${name}\r\nTEL:${phone}\r\nEMAIL:${email}\r\nURL:${site}\r\nEND:VCARD`;
      }

      if (type === "whatsapp") {
        return currentProfileData.whatsapp || "https://wa.me/923000000000";
      }

      if (type === "custom") {
        return (els.qrCustomUrlInput ? els.qrCustomUrlInput.value.trim() : "") || brandUrl;
      }

      return brandUrl;
    }

    function updateQrStudioPreview() {
      if (!els.qrStudioPreviewImg) return;

      const payload = getQrCodePayload();
      const fg = (els.qrFgColorInput ? els.qrFgColorInput.value : "#2A201A").replace("#", "");
      const bg = (els.qrBgColorInput ? els.qrBgColorInput.value : "#FFFFFF").replace("#", "");
      const size = els.qrSizeSlider ? els.qrSizeSlider.value : "300";
      const margin = els.qrMarginSlider ? els.qrMarginSlider.value : "4";
      const ecc = els.qrEccSelect ? els.qrEccSelect.value : "M";

      if (els.qrFgHex) els.qrFgHex.textContent = "#" + fg.toUpperCase();
      if (els.qrBgHex) els.qrBgHex.textContent = "#" + bg.toUpperCase();
      if (els.qrSizeVal) els.qrSizeVal.textContent = size;
      if (els.qrMarginVal) els.qrMarginVal.textContent = margin;

      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=${margin}&ecc=${ecc}&color=${fg}&bgcolor=${bg}&data=${encodeURIComponent(payload)}`;
      els.qrStudioPreviewImg.src = qrUrl;

      if (els.qrCenterLogoBadge && els.qrCenterLogoToggle) {
        els.qrCenterLogoBadge.style.display = els.qrCenterLogoToggle.checked ? "flex" : "none";
      }
    }

    // QR Inputs change listeners
    [
      els.qrTypeSelect,
      els.qrCustomUrlInput,
      els.qrFgColorInput,
      els.qrBgColorInput,
      els.qrSizeSlider,
      els.qrMarginSlider,
      els.qrEccSelect,
      els.qrCenterLogoToggle
    ].forEach(function (input) {
      if (input) {
        input.addEventListener("input", updateQrStudioPreview);
        input.addEventListener("change", updateQrStudioPreview);
      }
    });

    if (els.qrTypeSelect) {
      els.qrTypeSelect.addEventListener("change", function () {
        if (els.qrCustomUrlWrap) {
          els.qrCustomUrlWrap.classList.toggle("hidden", els.qrTypeSelect.value !== "custom");
        }
      });
    }

    // QR Color Preset Swatches
    document.querySelectorAll(".qr-color-preset").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const fg = btn.dataset.fg;
        const bg = btn.dataset.bg;
        if (els.qrFgColorInput) els.qrFgColorInput.value = fg;
        if (els.qrBgColorInput) els.qrBgColorInput.value = bg;
        updateQrStudioPreview();
      });
    });

    // Save QR Code settings to Card Back Face
    if (els.saveQrToCardBackBtn) {
      els.saveQrToCardBackBtn.addEventListener("click", async function () {
        const fg = els.qrFgColorInput ? els.qrFgColorInput.value : "#2A201A";
        const bg = els.qrBgColorInput ? els.qrBgColorInput.value : "#FFFFFF";
        const type = els.qrTypeSelect ? els.qrTypeSelect.value : "url";
        const ecc = els.qrEccSelect ? els.qrEccSelect.value : "M";

        currentProfileData.qrFgColor = fg;
        currentProfileData.qrBgColor = bg;
        currentProfileData.qrType = type;
        currentProfileData.qrEcc = ecc;

        try {
          if (db) {
            if (activeBrandId === "default") {
              await db.collection("settings").doc("profile").set({
                qrFgColor: fg,
                qrBgColor: bg,
                qrType: type,
                qrEcc: ecc
              }, { merge: true });
            } else {
              await db.collection("settings").doc("brand_" + activeBrandId).set({
                qrFgColor: fg,
                qrBgColor: bg,
                qrType: type,
                qrEcc: ecc
              }, { merge: true });
            }
          }
          showGlobal("QR Code style applied to Visiting Card Back face successfully!", false);
        } catch (err) {
          showGlobal("QR save error: " + err.message, true);
        }
      });
    }

    // Download QR Code as PNG
    if (els.downloadQrPngBtn) {
      els.downloadQrPngBtn.addEventListener("click", function () {
        if (!els.qrStudioPreviewImg || !els.qrStudioPreviewImg.src) return;
        const link = document.createElement("a");
        link.href = els.qrStudioPreviewImg.src;
        link.target = "_blank";
        link.download = "maryam-visiting-card-qr.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showGlobal("Downloading High-Resolution QR code image...", false);
      });
    }

    // Print Business Card Layout Sheet
    if (els.printCardLayoutBtn) {
      els.printCardLayoutBtn.addEventListener("click", function () {
        const brand = currentProfileData.brandName || "Maryam's Desgins";
        const tagline = currentProfileData.tagline || "Luxury Pret & Couture Edit";
        const phone = currentProfileData.phone || "+92 300 0000000";
        const qrSrc = els.qrStudioPreviewImg ? els.qrStudioPreviewImg.src : "";

        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${brand} — Visiting Card Print Sheet</title>
            <style>
              body { font-family: sans-serif; background: #fff; margin: 40px; color: #2A201A; }
              .sheet { display: flex; gap: 30px; justify-content: center; flex-wrap: wrap; }
              .card { width: 320px; height: 190px; border: 1px dashed #B6713F; border-radius: 12px; padding: 20px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; position: relative; }
              .card-title { font-family: serif; font-size: 20px; font-weight: bold; color: #B6713F; }
              .card-sub { font-size: 11px; color: #555; }
              .card-contact { font-size: 11px; font-weight: 600; margin-top: auto; }
              .card-back { align-items: center; justify-content: center; text-align: center; }
              .qr-img { width: 110px; height: 110px; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <div style="text-align:center; margin-bottom: 25px;">
              <h2>${brand} — Print-Ready Digital Visiting Card</h2>
              <p style="font-size: 12px; color: #666;">Standard 3.5" x 2" Ratio &bull; Cut along dotted borders</p>
            </div>
            <div class="sheet">
              <div class="card">
                <div>
                  <div class="card-title">${brand}</div>
                  <div class="card-sub">${tagline}</div>
                </div>
                <div class="card-contact">
                  <div>📞 ${phone}</div>
                  <div>🌐 maryamsdesign.com</div>
                </div>
              </div>
              <div class="card card-back">
                <img class="qr-img" src="${qrSrc}" />
                <div style="font-size: 10px; font-weight: bold; margin-top: 6px;">SCAN FOR DIGITAL CARD</div>
              </div>
            </div>
            <script>window.onload = function() { window.print(); };<\/script>
          </body>
          </html>
        `);
        printWindow.document.close();
      });
    }

    // ===================================================================
    // 4. THEME & PALETTE HANDLING
    // ===================================================================
    const THEME_PRESETS = {
      cinnamon: { themeBg: "#FFFFFF", pageBg: "#FAF7F2", buttonBg: "#FFFFFF", textColor: "#2A201A", accentColor: "#B6713F" },
      noir: { themeBg: "#1C1613", pageBg: "#120E0C", buttonBg: "#2A201A", textColor: "#F5EFEB", accentColor: "#D49A6A" },
      gold: { themeBg: "#FAF7F2", pageBg: "#F4ECE2", buttonBg: "#FFFFFF", textColor: "#2A201A", accentColor: "#D49A6A" },
      ivory: { themeBg: "#FFFFFF", pageBg: "#F8F8F9", buttonBg: "#FFFFFF", textColor: "#111827", accentColor: "#B6713F" }
    };

    function fillThemeForm(data) {
      if (!els.themeForm) return;
      const t = data || currentProfileData;
      Array.from(els.themeForm.elements).forEach(function (input) {
        if (input.name && t[input.name] !== undefined) {
          input.value = t[input.name];
        }
      });
    }

    document.querySelectorAll(".palette-preset-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const presetKey = btn.dataset.preset;
        const preset = THEME_PRESETS[presetKey];
        if (!preset) return;

        fillThemeForm(preset);
        showGlobal("Applied " + btn.textContent.trim() + " color preset. Click 'Save Theme Settings' to apply.", false);
      });
    });

    if (els.saveThemeBtn && els.themeForm) {
      els.saveThemeBtn.addEventListener("click", async function () {
        const formData = new FormData(els.themeForm);
        const themePayload = {};
        formData.forEach(function (val, key) { themePayload[key] = val; });

        Object.assign(currentProfileData, themePayload);

        try {
          if (db) {
            if (activeBrandId === "default") {
              await db.collection("settings").doc("profile").set(themePayload, { merge: true });
            } else {
              await db.collection("settings").doc("brand_" + activeBrandId).set(themePayload, { merge: true });
            }
          }
          showGlobal("Luxury Color Palette saved successfully!", false);
        } catch (err) {
          localStorage.setItem("md_local_profile_" + activeBrandId, JSON.stringify(currentProfileData));
          showGlobal("Color Palette saved locally for your visiting card! (Note: Paste firestore.rules in Firebase Console for multi-device sync).", false);
        }
      });
    }

    // ===================================================================
    // 5. PROFILE FORM HANDLING
    // ===================================================================
    function fillProfileForm(data) {
      currentProfileData = { ...DEFAULT_PROFILE, ...(data || {}) };
      if (!els.profileForm) return;

      Array.from(els.profileForm.elements).forEach(function (input) {
        if (input.name && currentProfileData[input.name] !== undefined) {
          input.value = currentProfileData[input.name];
        }
      });
      fillThemeForm(currentProfileData);
    }

    async function saveProfile() {
      if (!els.profileForm) return;
      const formData = new FormData(els.profileForm);
      const payload = {};
      formData.forEach(function (val, key) { payload[key] = val; });

      Object.assign(currentProfileData, payload);

      try {
        els.saveProfileBtn.disabled = true;
        els.saveProfileBtn.innerHTML = '<span>Saving...</span>';

        if (db) {
          if (activeBrandId === "default") {
            await db.collection("settings").doc("profile").set(payload, { merge: true });
          } else {
            await db.collection("settings").doc("brand_" + activeBrandId).set(payload, { merge: true });
          }
        }
        showGlobal("Brand profile & contact channels saved successfully.", false);
      } catch (err) {
        localStorage.setItem("md_local_profile_" + activeBrandId, JSON.stringify(currentProfileData));
        showGlobal("Profile saved locally! (Note: Paste firestore.rules in Firebase Console for multi-device sync).", false);
      } finally {
        els.saveProfileBtn.disabled = false;
        els.saveProfileBtn.innerHTML =
          '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline></svg>' +
          '<span>Save Profile</span>';
      }
    }

    // ===================================================================
    // 6. MULTI-BRAND OPERATIONS
    // ===================================================================
    function updateBrandUI() {
      const isDefault = activeBrandId === "default";
      const publicUrl = getBrandPublicUrl(activeBrandId);

      if (els.activeBrandSlugDisplay) {
        els.activeBrandSlugDisplay.textContent = isDefault ? "Root URL (Primary)" : "?brand=" + activeBrandId;
      }
      if (els.viewLiveCardLink) {
        els.viewLiveCardLink.href = publicUrl;
      }
      if (els.brandSwitcherSelect) {
        els.brandSwitcherSelect.value = activeBrandId;
      }
      if (els.makeDefaultBrandBtn) {
        els.makeDefaultBrandBtn.classList.toggle("hidden", isDefault);
      }
      updateQrStudioPreview();
      renderDashboardAnalytics();
    }

    async function selectBrand(brandId) {
      activeBrandId = brandId;
      updateBrandUI();
      restartDataListeners();
      showGlobal("Switched to brand: " + (brandId === "default" ? "Maryam's Desgins (Primary)" : brandId), false);
    }

    function renderBrandsList(brands) {
      if (!els.brandsListContainer) return;
      els.brandsListContainer.innerHTML = "";

      brands.forEach(function (b) {
        const isCurrent = b.id === activeBrandId;
        const isPrimary = b.id === "default" || b.isPrimary === true;
        const brandUrl = getBrandPublicUrl(b.id);

        const card = document.createElement("div");
        card.className = "p-4 rounded-xl border bg-white flex flex-wrap items-center justify-between gap-3 " +
          (isCurrent ? "border-amber-400 ring-2 ring-amber-100" : "border-gray-200");

        card.innerHTML = `
          <div class="min-w-[200px] flex-1">
            <div class="flex items-center gap-2">
              <h4 class="text-sm font-bold text-gray-900">${escapeHtml(b.name || b.id)}</h4>
              ${isPrimary ? '<span class="admin-chip admin-chip-live">Primary Default</span>' : ''}
              ${isCurrent ? '<span class="admin-chip" style="background:#fef3c7; color:#92400e; border-color:#fde68a;">Active Now</span>' : ''}
            </div>
            <p class="mt-1 font-mono text-[11px] text-gray-500 truncate">${escapeHtml(brandUrl)}</p>
          </div>
          <div class="flex items-center gap-2 flex-wrap ml-auto">
            ${
              !isCurrent
                ? '<button type="button" data-switch-brand="' + b.id + '" class="btn-primary btn-tight">Switch to Brand</button>'
                : '<span class="text-xs font-semibold text-amber-700">Currently Editing</span>'
            }
            <a href="${brandUrl}" target="_blank" class="btn-secondary btn-tight">Preview ↗</a>
            <button type="button" data-copy-url="${brandUrl}" class="btn-secondary btn-tight">Copy Link</button>
            ${
              !isPrimary
                ? '<button type="button" data-delete-brand="' + b.id + '" class="btn-danger btn-tight">Delete</button>'
                : ''
            }
          </div>
        `;

        els.brandsListContainer.appendChild(card);
      });
    }

    function populateBrandDropdown(brands) {
      if (!els.brandSwitcherSelect) return;
      els.brandSwitcherSelect.innerHTML = "";

      brands.forEach(function (b) {
        const opt = document.createElement("option");
        opt.value = b.id;
        opt.textContent = b.name + (b.id === "default" ? " (Primary)" : "");
        if (b.id === activeBrandId) opt.selected = true;
        els.brandSwitcherSelect.appendChild(opt);
      });
    }

    function startBrandsListener() {
      if (!db) return;
      if (unsubBrands) unsubBrands();

      unsubBrands = db.collection("settings").doc("brands_directory").onSnapshot(function (snap) {
        if (snap.exists && snap.data().list) {
          availableBrands = snap.data().list;
        } else {
          availableBrands = [{ id: "default", name: "Maryam's Desgins (Primary)", isPrimary: true }];
        }
        populateBrandDropdown(availableBrands);
        renderBrandsList(availableBrands);
        updateBrandUI();
      }, function (err) {
        console.warn("Brands directory notice:", err.message);
      });
    }

    async function createBrand(name, slug, tagline, phone) {
      if (!db) return;
      const cleanSlug = String(slug || "").toLowerCase().replace(/[^a-z0-9_-]/g, "").trim();
      if (!cleanSlug) throw new Error("A valid unique Brand Slug / ID is required (e.g. bridal).");
      if (cleanSlug === "default") throw new Error("'default' is reserved for the primary brand.");

      const newBrandDoc = {
        id: cleanSlug,
        brandName: name,
        tagline: tagline || "",
        username: cleanSlug,
        logoUrl: "",
        phone: phone || "",
        whatsapp: phone ? ("https://wa.me/" + phone.replace(/[^0-9]/g, "")) : "",
        email: "",
        website: "",
        address: "",
        hours: "",
        themeBg: "#FFFFFF",
        pageBg: "#FAF7F2",
        buttonBg: "#FFFFFF",
        textColor: "#2A201A",
        accentColor: "#B6713F",
        links: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      await db.collection("settings").doc("brand_" + cleanSlug).set(newBrandDoc);

      const brandsDirRef = db.collection("settings").doc("brands_directory");
      const snap = await brandsDirRef.get();
      let list = [{ id: "default", name: "Maryam's Desgins (Primary)", isPrimary: true }];
      if (snap.exists && snap.data().list) list = snap.data().list;

      if (!list.some(function (x) { return x.id === cleanSlug; })) {
        list.push({ id: cleanSlug, name: name, slug: cleanSlug, isPrimary: false });
        await brandsDirRef.set({ list: list });
      }

      if (els.newBrandFormCard) els.newBrandFormCard.classList.add("hidden");
      await selectBrand(cleanSlug);
      showGlobal("New brand profile '" + name + "' created successfully!", false);
    }

    async function deleteBrand(brandId) {
      if (!db || brandId === "default") return;
      if (!confirm("Are you sure you want to delete this brand and all its collections?")) return;

      try {
        await db.collection("settings").doc("brand_" + brandId).delete();

        const brandsDirRef = db.collection("settings").doc("brands_directory");
        const snap = await brandsDirRef.get();
        if (snap.exists && snap.data().list) {
          const updated = snap.data().list.filter(function (x) { return x.id !== brandId; });
          await brandsDirRef.set({ list: updated });
        }

        await selectBrand("default");
        showGlobal("Brand deleted successfully.", false);
      } catch (err) {
        showGlobal("Delete brand error: " + err.message, true);
      }
    }

    async function makeBrandDefault() {
      if (!db || activeBrandId === "default") return;
      if (!confirm("Make '" + activeBrandId + "' the primary default profile for root visitors (index.html)?")) return;

      try {
        const snap = await db.collection("settings").doc("brand_" + activeBrandId).get();
        if (snap.exists) {
          const brandData = snap.data();
          await db.collection("settings").doc("profile").set(brandData);
          showGlobal("Brand '" + activeBrandId + "' is now the primary default for index.html!", false);
        }
      } catch (err) {
        showGlobal("Set default error: " + err.message, true);
      }
    }

    // ===================================================================
    // 7. COLLECTIONS & LINKS RENDERING
    // ===================================================================
    function getCardHtml(link, isDraft) {
      const id = isDraft ? "draft" : (link.id || "idx_" + link.order);
      const isExpanded = isDraft || expandedCards.has(id);
      const isFeatured = link.featured === true;
      const isActive = link.active !== false;
      const order = link.order || 1;
      const badge = link.badge || "";
      const icon = link.icon || "";
      const title = link.title || "";
      const url = link.url || "";
      const desc = link.description || "";
      const image = link.image || "assets/maryam_logo_refinement.avif";

      if (!isExpanded) {
        return `
          <div data-card="${id}" class="collection-admin-card ${isFeatured ? 'is-featured' : ''} ${!isActive ? 'opacity-60' : ''}">
            <div class="flex items-center gap-3 min-w-0">
              <img src="${escapeHtml(image)}" class="w-12 h-12 rounded-lg object-cover border border-gray-100 flex-shrink-0" onerror="this.src='assets/maryam_logo_refinement.avif'" alt="" />
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-xs font-mono font-bold text-gray-400">#${order}</span>
                  <h4 class="text-sm font-bold text-gray-900 truncate">${icon ? escapeHtml(icon) + ' ' : ''}${escapeHtml(title || "Untitled")}</h4>
                  ${badge ? '<span class="admin-chip admin-chip-live">' + escapeHtml(badge) + '</span>' : ''}
                  ${isFeatured ? '<span class="admin-chip" style="background:#fef3c7; color:#92400e;">Featured</span>' : ''}
                </div>
                <p class="text-[11px] text-gray-500 truncate mt-0.5">${escapeHtml(url)}</p>
              </div>
            </div>
            <div class="flex items-center gap-2 ml-auto flex-shrink-0">
              <button type="button" data-edit="${id}" class="btn-secondary btn-tight">Edit</button>
              <button type="button" data-duplicate="${id}" class="btn-secondary btn-tight" title="Duplicate">Copy</button>
              <button type="button" data-delete="${id}" class="btn-danger btn-tight" title="Delete">✕</button>
            </div>
          </div>
        `;
      }

      return `
        <div data-card="${id}" class="collection-admin-card is-editing ${isFeatured ? 'is-featured' : ''}">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <h4 class="text-xs font-bold uppercase tracking-wider text-amber-700">
              ${isDraft ? 'New Collection' : 'Edit Collection #' + order}
            </h4>
            <div class="flex items-center gap-2">
              <button type="button" data-ai="${id}" class="btn-ai">
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                <span>AI Copy</span>
              </button>
              ${
                !isDraft
                  ? '<button type="button" data-collapse="' + id + '" class="btn-secondary btn-tight">Done Editing</button>'
                  : '<button type="button" data-cancel-draft="true" class="btn-secondary btn-tight">Cancel</button>'
              }
            </div>
          </div>

          <div class="grid gap-3 sm:grid-cols-2 mt-3">
            <label class="field-label sm:col-span-2">
              <span>Collection Title *</span>
              <input data-id="${id}" data-field="title" value="${escapeHtml(title)}" class="input" placeholder="e.g. Luxury Pret Collection" />
            </label>

            <label class="field-label sm:col-span-2">
              <span>Destination Link (URL or WhatsApp) *</span>
              <input data-id="${id}" data-field="url" value="${escapeHtml(url)}" class="input" placeholder="https://maryamsdesign.com/pret or https://wa.me/..." />
            </label>

            <label class="field-label sm:col-span-2">
              <span>Collection Description (Shown on visiting card)</span>
              <textarea data-id="${id}" data-field="description" rows="2" class="input">${escapeHtml(desc)}</textarea>
            </label>

            <label class="field-label">
              <span>Promotional Badge</span>
              <input data-id="${id}" data-field="badge" value="${escapeHtml(badge)}" class="input" placeholder="New Arrival, Festive Edit, Bespoke" />
            </label>

            <label class="field-label">
              <span>Icon / Emoji</span>
              <input data-id="${id}" data-field="icon" value="${escapeHtml(icon)}" class="input" placeholder="🛍️, ✨, 🌸" />
            </label>

            <label class="field-label">
              <span>Display Order Position</span>
              <input data-id="${id}" data-field="order" type="number" value="${order}" class="input" />
            </label>

            <div class="flex items-center gap-4 sm:col-span-2 pt-2">
              <label class="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                <input data-id="${id}" data-field="featured" type="checkbox" ${isFeatured ? 'checked' : ''} class="w-4 h-4 rounded text-amber-700" />
                <span>Featured Collection (Gold Glow Highlight)</span>
              </label>

              <label class="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                <input data-id="${id}" data-field="active" type="checkbox" ${isActive ? 'checked' : ''} class="w-4 h-4 rounded text-amber-700" />
                <span>Active &amp; Visible to Clients</span>
              </label>
            </div>

            <!-- Cover Image & Cloudinary Upload -->
            <div class="sm:col-span-2 pt-3 border-t border-gray-100">
              <span class="text-xs font-bold text-gray-700">Cover Photography</span>
              <div class="flex items-center gap-3 mt-2">
                <img data-preview="${id}" src="${escapeHtml(image)}" class="w-14 h-14 rounded-lg object-cover border border-gray-200 flex-shrink-0" onerror="this.src='assets/maryam_logo_refinement.avif'" alt="" />
                <div class="flex-1 min-w-0">
                  <input data-id="${id}" data-field="image" value="${escapeHtml(image)}" class="input image-input" placeholder="assets/1.png or Cloudinary URL" />
                  <div class="upload-row">
                    <input data-file="${id}" type="file" accept="image/*" class="hidden collection-file" />
                    <button type="button" data-upload="${id}" class="btn-small">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                      <span>Upload Photo to Cloudinary</span>
                    </button>
                    <span data-upload-status="${id}" class="upload-note">High-res vertical photography recommended</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            ${
              isDraft
                ? '<button type="button" data-create="true" class="btn-primary">Save New Collection</button>'
                : '<button type="button" data-save="' + id + '" class="btn-primary">Save Changes</button>'
            }
          </div>
        </div>
      `;
    }

    function renderAdminLinks(links) {
      if (!els.linksAdmin) return;
      if (!links.length) {
        els.linksAdmin.innerHTML =
          '<div class="rounded-xl border border-dashed border-gray-200 bg-gray-50/70 p-8 text-center text-xs text-gray-500">' +
          '<p class="font-bold text-gray-700 text-sm">No collections created yet</p>' +
          '<p class="mt-1">Click <strong>+ Add Collection</strong> to create your first visiting card link.</p>' +
          '</div>';
        return;
      }

      els.linksAdmin.innerHTML = links
        .slice()
        .sort(function (a, b) { return Number(a.order || 0) - Number(b.order || 0); })
        .map(function (link) { return getCardHtml(link, false); })
        .join("");
    }

    function showDraftCard() {
      if (!els.draftArea) return;
      els.draftArea.innerHTML = getCardHtml({
        title: "",
        url: "",
        badge: "New Arrival",
        icon: "🛍️",
        featured: false,
        active: true,
        order: currentLinks.length + 1,
        description: "",
        image: "assets/maryam_logo_refinement.avif"
      }, true);
      els.draftArea.classList.remove("hidden");
      els.draftArea.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function readFields(id) {
      const card = document.querySelector('[data-card="' + id + '"]');
      if (!card) return {};
      const inputs = card.querySelectorAll('[data-id="' + id + '"]');
      const data = {};
      inputs.forEach(function (inp) {
        const field = inp.dataset.field;
        if (!field) return;
        if (inp.type === "checkbox") {
          data[field] = inp.checked;
        } else if (inp.type === "number") {
          data[field] = Number(inp.value || 0);
        } else {
          data[field] = inp.value.trim();
        }
      });
      return data;
    }

    function generateCollectionCopy(id) {
      const titleInput = document.querySelector('[data-id="' + id + '"][data-field="title"]');
      const descInput = document.querySelector('[data-id="' + id + '"][data-field="description"]');
      const badgeInput = document.querySelector('[data-id="' + id + '"][data-field="badge"]');
      const title = titleInput ? titleInput.value.trim() : "";

      const templates = [
        "Handcrafted luxury ready-to-wear silhouettes designed with pure breathable fabrics and fine artisanal threadwork.",
        "Delicate florals, hand-embroidered motifs, and pure silk chiffon dupattas tailored for celebrations.",
        "Made-to-measure bridal ensembles featuring opulent zardozi, tilla, and gotta embellishments.",
        "Effortless casual chic tunics and co-ord sets designed for polished everyday elegance."
      ];

      const selected = templates[Math.floor(Math.random() * templates.length)];
      if (descInput) descInput.value = selected;
      if (badgeInput && !badgeInput.value) badgeInput.value = "Festive Edit";
      showGlobal("AI fashion copywriter generated description for " + (title || "collection") + ".", false);
    }

    // ===================================================================
    // 8. DATA LISTENERS & SEEDING
    // ===================================================================
    async function seedIfEmpty(force) {
      if (!db) return;
      const profileRef = db.collection("settings").doc("profile");
      const profileSnap = await profileRef.get();
      if (!profileSnap.exists) {
        await profileRef.set(DEFAULT_PROFILE);
      }

      if (force) {
        const batch = db.batch();
        DEMO_LINKS.forEach(function (item) {
          const ref = db.collection("links").doc();
          batch.set(ref, {
            ...item,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        });
        await batch.commit();
      }

      const brandsDirRef = db.collection("settings").doc("brands_directory");
      const bSnap = await brandsDirRef.get();
      if (!bSnap.exists) {
        await brandsDirRef.set({
          list: [
            { id: "default", name: "Maryam's Desgins (Primary)", slug: "default", isPrimary: true }
          ]
        });
      }
    }

    function restartDataListeners() {
      if (!db) {
        fillProfileForm(DEFAULT_PROFILE);
        currentLinks = DEFAULT_LINKS.slice();
        renderAdminLinks(currentLinks);
        return;
      }

      if (unsubProfile) unsubProfile();
      if (unsubLinks) unsubLinks();

      if (activeBrandId === "default") {
        unsubProfile = db.collection("settings").doc("profile").onSnapshot(function (snap) {
          if (snap.exists) fillProfileForm(snap.data());
          else fillProfileForm(DEFAULT_PROFILE);
        });

        unsubLinks = db.collection("links").orderBy("order", "asc").onSnapshot(function (snap) {
          currentLinks = snap.docs.map(function (d) { return { id: d.id, ...d.data() }; });
          renderAdminLinks(currentLinks);
        });
      } else {
        unsubProfile = db.collection("settings").doc("brand_" + activeBrandId).onSnapshot(function (snap) {
          if (snap.exists) {
            const data = snap.data();
            fillProfileForm(data);
            currentLinks = data.links && Array.isArray(data.links) ? data.links : [];
            renderAdminLinks(currentLinks);
          }
        });
      }
    }

    // ===================================================================
    // 9. SYSTEM BACKUPS & EXPORT/IMPORT
    // ===================================================================
    if (els.exportDataBtn) {
      els.exportDataBtn.addEventListener("click", function () {
        const backupData = {
          exportDate: new Date().toISOString(),
          brandId: activeBrandId,
          profile: currentProfileData,
          links: currentLinks,
          brands: availableBrands
        };

        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `maryam-designs-backup-${activeBrandId}-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showGlobal("Full data backup JSON downloaded.", false);
      });
    }

    if (els.importDataInput) {
      els.importDataInput.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async function (evt) {
          try {
            const parsed = JSON.parse(evt.target.result);
            if (parsed.profile) {
              fillProfileForm(parsed.profile);
              if (db) {
                if (activeBrandId === "default") {
                  await db.collection("settings").doc("profile").set(parsed.profile, { merge: true });
                } else {
                  await db.collection("settings").doc("brand_" + activeBrandId).set(parsed.profile, { merge: true });
                }
              }
            }
            showGlobal("Backup data imported successfully!", false);
          } catch (err) {
            showGlobal("Import JSON error: " + err.message, true);
          }
        };
        reader.readAsText(file);
      });
    }

    // ===================================================================
    // 10. CLOUDINARY LOGO UPLOAD HELPER
    // ===================================================================
    function cloudinaryReady() {
      return window.cloudinaryConfig &&
        window.cloudinaryConfig.cloudName &&
        window.cloudinaryConfig.uploadPreset &&
        !window.cloudinaryConfig.cloudName.includes("PASTE_") &&
        !window.cloudinaryConfig.uploadPreset.includes("PASTE_");
    }

    function updateCloudinaryStatus() {
      if (!els.cloudinaryStatus || !els.cloudinaryHelp) return;
      if (cloudinaryReady()) {
        els.cloudinaryStatus.textContent = "Connected & Active";
        els.cloudinaryStatus.className = "admin-chip admin-chip-live";
        els.cloudinaryHelp.textContent = "Cloud image delivery is active and optimized for high-speed browsing.";
      } else {
        els.cloudinaryStatus.textContent = "Storage Not Configured";
        els.cloudinaryStatus.className = "admin-chip admin-chip-muted";
        els.cloudinaryHelp.textContent = "Storage setup required for custom cloud media.";
      }
    }

    async function uploadToCloudinary(file) {
      if (!cloudinaryReady()) {
        throw new Error("Cloudinary Cloud Name is missing in js/cloudinary-config.js.");
      }
      const cfg = window.cloudinaryConfig;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", cfg.uploadPreset);
      if (cfg.folder) formData.append("folder", cfg.folder);

      const endpoint = "https://api.cloudinary.com/v1_1/" + cfg.cloudName + "/image/upload";
      const res = await fetch(endpoint, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error && data.error.message ? data.error.message : "Cloudinary upload failed.");
      }
      return data.secure_url;
    }

    // ===================================================================
    // 11. ATTACH GENERAL EVENT LISTENERS
    // ===================================================================

    // Password visibility toggle
    if (els.togglePasswordBtn && els.password) {
      els.togglePasswordBtn.addEventListener("click", function () {
        const show = els.password.type === "password";
        els.password.type = show ? "text" : "password";
        els.togglePasswordBtn.textContent = show ? "Hide" : "Show";
      });
    }

    // Forgot Password Action
    if (els.forgotPasswordBtn && auth) {
      els.forgotPasswordBtn.addEventListener("click", async function () {
        const email = (els.email ? els.email.value : "").trim();
        if (!email) {
          if (els.loginMsg) {
            els.loginMsg.textContent = "Please enter your registered email address first, then click Forgot password.";
            els.loginMsg.classList.remove("hidden");
          }
          return;
        }

        try {
          await auth.sendPasswordResetEmail(email);
          showGlobal("Password reset instructions sent to " + email + ". Check your email inbox.", false);
        } catch (error) {
          if (els.loginMsg) {
            els.loginMsg.textContent = "Reset Error: " + error.message;
            els.loginMsg.classList.remove("hidden");
          }
        }
      });
    }

    // Standard Secure Firebase Login
    if (els.loginBtn && auth) {
      els.loginBtn.addEventListener("click", async function () {
        const email = els.email.value.trim();
        const password = els.password.value;
        if (!email || !password) {
          if (els.loginMsg) {
            els.loginMsg.textContent = "Please enter your administrator email and password.";
            els.loginMsg.classList.remove("hidden");
          }
          return;
        }

        try {
          els.loginBtn.disabled = true;
          els.loginBtnText.textContent = "Verifying Credentials...";
          if (els.loginMsg) els.loginMsg.classList.add("hidden");
          await auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
          if (els.loginMsg) {
            els.loginMsg.textContent = "Authentication Failed: " + error.message;
            els.loginMsg.classList.remove("hidden");
          }
        } finally {
          els.loginBtn.disabled = false;
          els.loginBtnText.textContent = "Sign In to Dashboard";
        }
      });
    }

    if (els.logoutBtn) {
      els.logoutBtn.addEventListener("click", function () {
        if (auth) auth.signOut().catch(console.warn);
        if (els.adminScreen) els.adminScreen.classList.add("hidden");
        if (els.loginScreen) els.loginScreen.classList.remove("hidden");
      });
    }

    if (els.saveProfileBtn) els.saveProfileBtn.addEventListener("click", saveProfile);
    if (els.addLinkBtn) els.addLinkBtn.addEventListener("click", showDraftCard);
    if (els.makeDefaultBrandBtn) els.makeDefaultBrandBtn.addEventListener("click", makeBrandDefault);

    // Multi-Brand Controls
    if (els.brandSwitcherSelect) {
      els.brandSwitcherSelect.addEventListener("change", function () {
        selectBrand(els.brandSwitcherSelect.value);
      });
    }

    if (els.copyBrandLinkBtn) {
      els.copyBrandLinkBtn.addEventListener("click", function () {
        const url = getBrandPublicUrl(activeBrandId);
        navigator.clipboard.writeText(url).then(function () {
          showGlobal("Brand URL copied to clipboard: " + url, false);
        });
      });
    }

    if (els.quickNewBrandBtn) {
      els.quickNewBrandBtn.addEventListener("click", function () {
        switchPanel("brandsSection");
        if (els.newBrandFormCard) els.newBrandFormCard.classList.remove("hidden");
      });
    }

    if (els.openCreateBrandModalBtn) {
      els.openCreateBrandModalBtn.addEventListener("click", function () {
        if (els.newBrandFormCard) els.newBrandFormCard.classList.remove("hidden");
      });
    }

    if (els.cancelNewBrandBtn) {
      els.cancelNewBrandBtn.addEventListener("click", function () {
        if (els.newBrandFormCard) els.newBrandFormCard.classList.add("hidden");
      });
    }

    if (els.saveNewBrandBtn) {
      els.saveNewBrandBtn.addEventListener("click", async function () {
        const name = (els.newBrandNameInput.value || "").trim();
        const slug = (els.newBrandSlugInput.value || "").trim();
        const tagline = (els.newBrandTaglineInput.value || "").trim();
        const phone = (els.newBrandPhoneInput.value || "").trim();

        if (!name || !slug) {
          showGlobal("Brand Name and Slug / URL ID are required.", true);
          return;
        }

        try {
          els.saveNewBrandBtn.disabled = true;
          await createBrand(name, slug, tagline, phone);
        } catch (err) {
          showGlobal("Create Brand Error: " + err.message, true);
        } finally {
          els.saveNewBrandBtn.disabled = false;
        }
      });
    }

    // Panel switching delegation
    document.body.addEventListener("click", function (e) {
      const panelLink = e.target.closest("[data-panel-link]");
      if (panelLink) {
        switchPanel(panelLink.dataset.panelLink);
        return;
      }

      const switchBtn = e.target.closest("[data-switch-brand]");
      if (switchBtn) {
        selectBrand(switchBtn.dataset.switchBrand);
        return;
      }

      const deleteBtn = e.target.closest("[data-delete-brand]");
      if (deleteBtn) {
        deleteBrand(deleteBtn.dataset.deleteBrand);
        return;
      }

      const copyBtn = e.target.closest("[data-copy-url]");
      if (copyBtn) {
        navigator.clipboard.writeText(copyBtn.dataset.copyUrl).then(function () {
          showGlobal("Link copied to clipboard!", false);
        });
        return;
      }
    });

    // Seed Demo
    if (els.seedBtn) {
      els.seedBtn.addEventListener("click", async function () {
        if (confirm("Populate initial demo boutique collections into Firestore?")) {
          try {
            await seedIfEmpty(true);
            showGlobal("Demo boutique collections added successfully.", false);
          } catch (error) {
            showGlobal("Demo error: " + error.message, true);
          }
        }
      });
    }

    // Profile Logo Cloudinary Upload
    if (els.uploadProfileLogoBtn && els.profileLogoFile) {
      els.uploadProfileLogoBtn.addEventListener("click", function () {
        els.profileLogoFile.click();
      });

      els.profileLogoFile.addEventListener("change", async function () {
        const file = els.profileLogoFile.files[0];
        if (!file) return;

        try {
          els.uploadProfileLogoBtn.disabled = true;
          els.uploadProfileLogoBtn.innerHTML = '<span>Uploading...</span>';
          const url = await uploadToCloudinary(file);
          if (els.logoUrlInput) els.logoUrlInput.value = url;
          showGlobal("Logo uploaded to Cloudinary. Click Save Profile to apply.", false);
        } catch (error) {
          showGlobal("Logo upload error: " + error.message, true);
        } finally {
          els.uploadProfileLogoBtn.disabled = false;
          els.uploadProfileLogoBtn.innerHTML =
            '<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>' +
            '<span>Upload Logo to Cloudinary</span>';
          els.profileLogoFile.value = "";
        }
      });
    }

    // Live thumbnail preview on input
    document.body.addEventListener("input", function (e) {
      if (e.target.classList.contains("image-input")) {
        const id = e.target.dataset.id;
        const img = document.querySelector('[data-preview="' + id + '"]');
        if (img) img.src = e.target.value || "assets/maryam_logo_refinement.avif";
      }
    });

    // Delegated Collection Card Actions
    document.body.addEventListener("click", async function (e) {
      const target = e.target.closest("[data-edit], [data-collapse], [data-ai], [data-cancel-draft], [data-upload], [data-create], [data-save], [data-duplicate], [data-delete]");
      if (!target) return;

      if (target.dataset.edit) {
        expandedCards.add(target.dataset.edit);
        renderAdminLinks(currentLinks);
        const card = document.querySelector('[data-card="' + target.dataset.edit + '"]');
        if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      if (target.dataset.collapse) {
        expandedCards.delete(target.dataset.collapse);
        renderAdminLinks(currentLinks);
        return;
      }

      if (target.dataset.ai) {
        generateCollectionCopy(target.dataset.ai);
        return;
      }

      if (target.dataset.cancelDraft) {
        els.draftArea.innerHTML = "";
        els.draftArea.classList.add("hidden");
        return;
      }

      if (target.dataset.upload) {
        const id = target.dataset.upload;
        const fileInput = document.querySelector('[data-file="' + id + '"]');
        if (fileInput) fileInput.click();
        return;
      }

      try {
        if (target.dataset.create) {
          const payload = readFields("draft");
          if (!payload.title || !payload.url) {
            showGlobal("Collection Title and Destination URL are required.", true);
            return;
          }

          if (activeBrandId === "default") {
            payload.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            if (db) await db.collection("links").add(payload);
          } else {
            const brandDocRef = db.collection("settings").doc("brand_" + activeBrandId);
            const snap = await brandDocRef.get();
            const existingLinks = (snap.exists && snap.data().links) ? snap.data().links : [];
            payload.id = "link_" + Date.now();
            existingLinks.push(payload);
            await brandDocRef.set({ links: existingLinks }, { merge: true });
          }

          els.draftArea.innerHTML = "";
          els.draftArea.classList.add("hidden");
          showGlobal("New collection link created successfully.", false);
        }

        if (target.dataset.save) {
          const id = target.dataset.save;
          const payload = readFields(id);
          if (!payload.title || !payload.url) {
            showGlobal("Collection Title and Destination URL are required.", true);
            return;
          }

          if (activeBrandId === "default") {
            if (db) await db.collection("links").doc(id).update(payload);
          } else {
            const brandDocRef = db.collection("settings").doc("brand_" + activeBrandId);
            const updated = currentLinks.map(function (item) {
              const itemId = item.id || "idx_" + item.order;
              return itemId === id ? { ...item, ...payload } : item;
            });
            await brandDocRef.set({ links: updated }, { merge: true });
          }

          expandedCards.delete(id);
          showGlobal("Collection link updated successfully.", false);
        }

        if (target.dataset.duplicate) {
          const id = target.dataset.duplicate;
          const item = currentLinks.find(function (x) {
            return (x.id || "idx_" + x.order) === id;
          });

          if (item) {
            const copy = { ...item };
            delete copy.id;
            copy.title = (copy.title || "Collection") + " (Copy)";
            copy.order = currentLinks.length + 1;

            if (activeBrandId === "default") {
              copy.createdAt = firebase.firestore.FieldValue.serverTimestamp();
              copy.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
              if (db) await db.collection("links").add(copy);
            } else {
              copy.id = "link_" + Date.now();
              const brandDocRef = db.collection("settings").doc("brand_" + activeBrandId);
              const updated = currentLinks.slice();
              updated.push(copy);
              await brandDocRef.set({ links: updated }, { merge: true });
            }
            showGlobal("Collection link duplicated.", false);
          }
        }

        if (target.dataset.delete) {
          const id = target.dataset.delete;
          if (confirm("Are you sure you want to delete this collection card?")) {
            if (activeBrandId === "default") {
              if (db) await db.collection("links").doc(id).delete();
            } else {
              const brandDocRef = db.collection("settings").doc("brand_" + activeBrandId);
              const updated = currentLinks.filter(function (x) {
                return (x.id || "idx_" + x.order) !== id;
              });
              await brandDocRef.set({ links: updated }, { merge: true });
            }
            showGlobal("Collection link deleted.", false);
          }
        }
      } catch (error) {
        showGlobal("Error: " + error.message, true);
      }
    });

    // Cloudinary file upload delegation for collections
    document.body.addEventListener("change", async function (e) {
      if (!e.target.classList.contains("collection-file")) return;
      const id = e.target.dataset.file;
      const file = e.target.files[0];
      if (!file) return;

      const status = document.querySelector('[data-upload-status="' + id + '"]');
      const imageInput = document.querySelector('[data-id="' + id + '"][data-field="image"]');
      const preview = document.querySelector('[data-preview="' + id + '"]');

      try {
        if (status) status.textContent = "Uploading to Cloudinary...";
        const url = await uploadToCloudinary(file);
        if (imageInput) imageInput.value = url;
        if (preview) preview.src = url;
        if (status) status.textContent = "Uploaded! Click Save Changes.";
        showGlobal("Image uploaded. Click Save Changes to persist.", false);
      } catch (error) {
        if (status) status.textContent = "Upload failed.";
        showGlobal("Cloudinary upload error: " + error.message, true);
      } finally {
        e.target.value = "";
      }
    });

    // Strict Firebase Auth State Listener & Security Guard
    if (auth) {
      auth.onAuthStateChanged(async function (user) {
        if (user) {
          // Authorized Admin Session
          if (els.loginScreen) els.loginScreen.classList.add("hidden");
          if (els.adminScreen) els.adminScreen.classList.remove("hidden");
          if (els.adminUserText) els.adminUserText.textContent = user.email;

          switchPanel("dashboardSection");
          updateCloudinaryStatus();
          updateBrandUI();

          try {
            await seedIfEmpty(false);
            startBrandsListener();
            restartDataListeners();
          } catch (error) {
            showGlobal("Initialization note: " + error.message, true);
          }
        } else {
          // Strictly Lock Screen: Unauthenticated access blocked
          if (els.adminScreen) els.adminScreen.classList.add("hidden");
          if (els.loginScreen) els.loginScreen.classList.remove("hidden");
          if (unsubProfile) { unsubProfile(); unsubProfile = null; }
          if (unsubLinks) { unsubLinks(); unsubLinks = null; }
          if (unsubBrands) { unsubBrands(); unsubBrands = null; }
        }
      });
    } else {
      // If Firebase Auth not available, stay locked on login
      if (els.adminScreen) els.adminScreen.classList.add("hidden");
      if (els.loginScreen) els.loginScreen.classList.remove("hidden");
    }
  });
})();
