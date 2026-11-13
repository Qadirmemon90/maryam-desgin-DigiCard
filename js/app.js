/* ==========================================================================
   MARYAM'S DESGINS — DIGITAL VISITING CARD APPLICATION (APP.JS)
   Modern Minimalist Digital Identity Experience
   Multi-Brand URL Resolution & Real-time Firestore Synchronization
   ========================================================================== */

const DEFAULT_PROFILE = {
  brandName: "",
  tagline: "",
  username: "",
  logoUrl: "",
  phone: "",
  whatsapp: "",
  email: "",
  instagram: "",
  facebook: "",
  tiktok: "",
  pinterest: "",
  website: "",
  address: "",
  hours: "",
  bio: "",
  themeBg: "#FFFFFF",
  pageBg: "#FAF7F2",
  buttonBg: "#FFFFFF",
  textColor: "#2A201A",
  accentColor: "#B6713F",
  qrFgColor: "#2A201A",
  qrBgColor: "#FFFFFF",
  qrType: "url",
  qrEcc: "M"
};

(function () {
  if (typeof firebase !== "undefined" && window.firebaseConfig) {
    if (!firebase.apps.length) {
      firebase.initializeApp(window.firebaseConfig);
    }
  }

  const db = (typeof firebase !== "undefined" && firebase.firestore) ? firebase.firestore() : null;

  document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements Mapping
    const els = {
      phoneCard: document.getElementById("phoneCard"),
      previewLogo: document.getElementById("previewLogo"),
      previewBrand: document.getElementById("previewBrand"),
      previewTagline: document.getElementById("previewTagline"),
      previewUsername: document.getElementById("previewUsername"),
      footerBrandName: document.getElementById("footerBrandName"),

      // Quick Actions
      saveContactBtn: document.getElementById("saveContactBtn"),
      shareCardBtn: document.getElementById("shareCardBtn"),
      flipToBackBtn: document.getElementById("flipToBackBtn"),
      flipToFrontBtn: document.getElementById("flipToFrontBtn"),

      // Quick-touch direct links
      callLink: document.getElementById("callLink"),
      cardWhatsappBtn: document.getElementById("cardWhatsappBtn"),
      emailLink: document.getElementById("emailLink"),
      directionsLink: document.getElementById("directionsLink"),

      // Social Links
      whatsappLink: document.getElementById("whatsappLink"),
      instagramLink: document.getElementById("instagramLink"),
      facebookLink: document.getElementById("facebookLink"),
      tiktokLink: document.getElementById("tiktokLink"),
      pinterestLink: document.getElementById("pinterestLink"),
      websiteLink: document.getElementById("websiteLink"),

      // Back Face Elements
      backQrImg: document.getElementById("backQrImg"),
      backPhoneText: document.getElementById("backPhoneText"),
      backAddressText: document.getElementById("backAddressText"),
      backHoursText: document.getElementById("backHoursText"),

      // Tab Links & Sections
      linksPublic: document.getElementById("linksPublic"),
      aboutStoryText: document.getElementById("aboutStoryText"),
      tabWaLink: document.getElementById("tabWaLink"),
      tabEmailLink: document.getElementById("tabEmailLink"),
      tabAddressText: document.getElementById("tabAddressText"),
      mainCtaBtn: document.getElementById("mainCtaBtn"),
      serviceBridalLink: document.getElementById("serviceBridalLink"),
      serviceShippingLink: document.getElementById("serviceShippingLink"),

      // Share Modal Elements
      shareModal: document.getElementById("shareModal"),
      closeShareModalBtn: document.getElementById("closeShareModalBtn"),
      qrCodeImg: document.getElementById("qrCodeImg"),
      shareUrlInput: document.getElementById("shareUrlInput"),
      copyShareUrlBtn: document.getElementById("copyShareUrlBtn"),
      shareWhatsappBtn: document.getElementById("shareWhatsappBtn"),
      toastContainer: document.getElementById("toastContainer")
    };

    let currentProfile = { ...DEFAULT_PROFILE };

    // Escape helper
    function escapeHtml(str) {
      return String(str || "").replace(/[&<>"']/g, function (m) {
        return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m];
      });
    }

    // Toast Notification
    function showToast(message) {
      if (!els.toastContainer) return;
      const toast = document.createElement("div");
      toast.className = "toast-item";
      toast.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>' +
        '<span>' + escapeHtml(message) + '</span>';
      els.toastContainer.appendChild(toast);

      setTimeout(function () {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(10px)";
        toast.style.transition = "all 0.25s ease";
        setTimeout(function () { toast.remove(); }, 250);
      }, 3000);
    }

    // Clipboard Copy Helper
    function copyToClipboard(text, successMsg) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          showToast(successMsg || "Link copied to clipboard!");
        }).catch(function () {
          fallbackCopy(text, successMsg);
        });
      } else {
        fallbackCopy(text, successMsg);
      }
    }

    function fallbackCopy(text, successMsg) {
      const temp = document.createElement("textarea");
      temp.value = text;
      temp.style.position = "fixed";
      temp.style.opacity = "0";
      document.body.appendChild(temp);
      temp.select();
      try {
        document.execCommand("copy");
        showToast(successMsg || "Link copied!");
      } catch (e) {
        showToast("Press Ctrl+C to copy");
      }
      document.body.removeChild(temp);
    }

    // Format phone string for tel: and vCard
    function cleanPhone(raw) {
      if (!raw) return "+923000000000";
      if (raw.includes("wa.me/")) {
        return "+" + raw.split("wa.me/")[1].replace(/[^0-9]/g, "");
      }
      return raw.replace(/[^0-9+]/g, "");
    }

    // Apply Profile data to all visual UI elements
    function applyProfile(data) {
      currentProfile = { ...DEFAULT_PROFILE, ...(data || {}) };

      // Page Canvas Gradient
      if (currentProfile.pageBg) {
        const accent = currentProfile.accentColor || "#B6713F";
        document.body.style.background =
          "radial-gradient(at 15% 12%, " + accent + "22 0px, transparent 48%), " +
          "radial-gradient(at 85% 18%, #D49A6A20 0px, transparent 42%), " +
          "radial-gradient(at 50% 92%, " + accent + "14 0px, transparent 55%), " +
          "linear-gradient(180deg, " + currentProfile.pageBg + " 0%, #F5EFEB 100%)";
      }

      // Card Face Colors
      const cardFaces = document.querySelectorAll(".card-face");
      cardFaces.forEach(function (face) {
        if (currentProfile.themeBg) face.style.backgroundColor = currentProfile.themeBg;
        if (currentProfile.textColor) face.style.color = currentProfile.textColor;
      });

      // Brand Typography & Identity
      const brandName = currentProfile.brandName;
      if (els.previewBrand) {
        if (brandName) {
          els.previewBrand.textContent = brandName;
        } else {
          els.previewBrand.innerHTML = '<span class="skeleton-text w-40 h-7 inline-block rounded">Loading...</span>';
        }
      }
      const copyYearEl = document.getElementById("footerCopyrightYear");
      if (copyYearEl) {
        copyYearEl.textContent = new Date().getFullYear();
      }
      if (brandName) {
        document.title = brandName + " — Premium Digital Visiting Card & Collections";
      }

      if (els.previewTagline) {
        if (currentProfile.tagline) {
          els.previewTagline.textContent = currentProfile.tagline;
        } else {
          els.previewTagline.innerHTML = '<span class="skeleton-text w-52 h-4 inline-block rounded">Loading...</span>';
        }
      }

      // Logo
      if (els.previewLogo) {
        if (currentProfile.logoUrl) {
          els.previewLogo.src = currentProfile.logoUrl;
        } else {
          els.previewLogo.src = "assets/maryam_logo_refinement.avif";
        }
      }

      // Username / Handle
      if (els.previewUsername) {
        if (currentProfile.username) {
          const uname = currentProfile.username.startsWith("@") ? currentProfile.username : "@" + currentProfile.username;
          const span = els.previewUsername.querySelector("span");
          if (span) span.textContent = uname;
          else els.previewUsername.textContent = uname;
        } else {
          const span = els.previewUsername.querySelector("span");
          if (span) span.innerHTML = '<span class="skeleton-text w-24 h-3.5 inline-block rounded">Loading...</span>';
        }
      }

      // Contact channels
      const phoneNum = currentProfile.phone;
      const waUrl = currentProfile.whatsapp;
      const email = currentProfile.email;
      const address = currentProfile.address;
      const hours = currentProfile.hours;

      if (els.callLink) els.callLink.href = phoneNum ? ("tel:" + cleanPhone(phoneNum)) : "#";
      if (els.cardWhatsappBtn) els.cardWhatsappBtn.href = waUrl || "#";
      if (els.whatsappLink) els.whatsappLink.href = waUrl || "#";
      if (els.mainCtaBtn) els.mainCtaBtn.href = waUrl || "#";
      if (els.tabWaLink) {
        els.tabWaLink.href = waUrl || "#";
        if (phoneNum) els.tabWaLink.textContent = phoneNum;
        else els.tabWaLink.innerHTML = '<span class="skeleton-text w-32 h-4 inline-block rounded">Loading...</span>';
      }
      if (els.emailLink) els.emailLink.href = email ? ("mailto:" + email) : "#";
      if (els.tabEmailLink) {
        els.tabEmailLink.href = email ? ("mailto:" + email) : "#";
        if (email) els.tabEmailLink.textContent = email;
        else els.tabEmailLink.innerHTML = '<span class="skeleton-text w-44 h-4 inline-block rounded">Loading...</span>';
      }
      if (els.directionsLink) {
        els.directionsLink.href = address ? ("https://maps.google.com/?q=" + encodeURIComponent(address)) : "#";
      }
      if (els.tabAddressText) {
        if (address) els.tabAddressText.textContent = address;
        else els.tabAddressText.innerHTML = '<span class="skeleton-text w-52 h-4 inline-block rounded">Loading...</span>';
      }

      // Card Back Details
      if (els.backPhoneText) {
        if (phoneNum) els.backPhoneText.textContent = phoneNum;
        else els.backPhoneText.innerHTML = '<span class="skeleton-text w-32 h-3.5 inline-block rounded">Loading...</span>';
      }
      if (els.backAddressText) {
        if (address) els.backAddressText.textContent = address;
        else els.backAddressText.innerHTML = '<span class="skeleton-text w-44 h-3.5 inline-block rounded">Loading...</span>';
      }
      if (els.backHoursText) {
        if (hours) els.backHoursText.textContent = hours;
        else els.backHoursText.innerHTML = '<span class="skeleton-text w-36 h-3.5 inline-block rounded">Loading...</span>';
      }

      if (els.aboutStoryText) {
        if (currentProfile.bio) {
          els.aboutStoryText.textContent = currentProfile.bio;
        } else {
          els.aboutStoryText.innerHTML = '<span class="skeleton-text w-full h-4 inline-block rounded mb-1.5">Loading...</span><span class="skeleton-text w-5/6 h-4 inline-block rounded mb-1.5"></span><span class="skeleton-text w-2/3 h-4 inline-block rounded"></span>';
        }
      }

      // Social Links
      if (els.instagramLink) els.instagramLink.href = currentProfile.instagram || "#";
      if (els.facebookLink) els.facebookLink.href = currentProfile.facebook || "#";
      if (els.tiktokLink) els.tiktokLink.href = currentProfile.tiktok || "#";
      if (els.pinterestLink) els.pinterestLink.href = currentProfile.pinterest || "#";
      if (els.websiteLink) els.websiteLink.href = currentProfile.website || "#";

      // Services consultation links
      const brandDisplay = brandName || "Boutique";
      const bridalMsg = encodeURIComponent("Hi " + brandDisplay + ", I would like to inquire about Custom Bridal & Formal Couture.");
      const shipMsg = encodeURIComponent("Hi " + brandDisplay + ", I would like to inquire about Worldwide Shipping rates.");
      const baseWa = (waUrl || "#").split("?")[0];
      if (els.serviceBridalLink) els.serviceBridalLink.href = waUrl ? (baseWa + "?text=" + bridalMsg) : "#";
      if (els.serviceShippingLink) els.serviceShippingLink.href = waUrl ? (baseWa + "?text=" + shipMsg) : "#";

      // Update Back QR Code image with dynamic styling & payload
      if (els.backQrImg) {
        const currentUrl = window.location.href;
        const fg = (currentProfile.qrFgColor || "2a201a").replace("#", "");
        const bg = (currentProfile.qrBgColor || "ffffff").replace("#", "");
        const ecc = currentProfile.qrEcc || "M";
        let payload = currentUrl;
        if (currentProfile.qrType === "vcard") {
          payload = "BEGIN:VCARD\r\nVERSION:3.0\r\nFN:" + brandName + "\r\nORG:" + brandName + "\r\nTEL:" + cleanPhone(phoneNum) + "\r\nEMAIL:" + email + "\r\nURL:" + (currentProfile.website || "https://maryamsdesign.com") + "\r\nEND:VCARD";
        } else if (currentProfile.qrType === "whatsapp") {
          payload = waUrl;
        }
        els.backQrImg.src = "https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=6&ecc=" + ecc + "&color=" + fg + "&bgcolor=" + bg + "&data=" + encodeURIComponent(payload);
      }
    }

    // Analytics Tracker
    function trackEvent(type, detail) {
      try {
        const bId = requestedBrand || "default";
        const key = "md_analytics_" + bId;
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const dev = isMobile ? "Mobile" : "Desktop";
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        let stats = {
          totalViews: 0,
          uniqueVisitors: 0,
          qrScans: 0,
          waInquiries: 0,
          callClicks: 0,
          vcardDownloads: 0,
          shareClicks: 0,
          channels: { whatsapp: 0, vcard: 0, call: 0, share: 0 },
          events: []
        };
        const raw = localStorage.getItem(key);
        if (raw) {
          try { stats = JSON.parse(raw); } catch (e) {}
        }
        if (!stats.channels) stats.channels = { whatsapp: 0, vcard: 0, call: 0, share: 0 };
        if (!stats.events) stats.events = [];

        let label = "";
        if (type === "page_view") {
          stats.totalViews = (stats.totalViews || 0) + 1;
          label = "Visiting card viewed (" + dev + ")";
        } else if (type === "vcard_download") {
          stats.vcardDownloads = (stats.vcardDownloads || 0) + 1;
          stats.channels.vcard = (stats.channels.vcard || 0) + 1;
          label = "Contact saved to address book (.vcf)";
        } else if (type === "qr_scan") {
          stats.qrScans = (stats.qrScans || 0) + 1;
          label = "Card flipped to QR Code";
        } else if (type === "wa_click") {
          stats.waInquiries = (stats.waInquiries || 0) + 1;
          stats.channels.whatsapp = (stats.channels.whatsapp || 0) + 1;
          label = "Direct WhatsApp chat initiated";
        } else if (type === "call_click") {
          stats.callClicks = (stats.callClicks || 0) + 1;
          stats.channels.call = (stats.channels.call || 0) + 1;
          label = "Direct boutique call clicked";
        } else if (type === "share_click") {
          stats.shareClicks = (stats.shareClicks || 0) + 1;
          stats.channels.share = (stats.channels.share || 0) + 1;
          label = "Card shared";
        } else if (type === "collection_click") {
          label = "Explored collection: " + (detail || "Item");
        }

        stats.events.unshift({
          type: type,
          label: label,
          time: timeStr,
          device: dev
        });
        if (stats.events.length > 25) stats.events = stats.events.slice(0, 25);
        localStorage.setItem(key, JSON.stringify(stats));

        if (db) {
          const inc = firebase.firestore.FieldValue.increment(1);
          const update = { lastUpdated: firebase.firestore.FieldValue.serverTimestamp() };
          if (type === "page_view") update.totalViews = inc;
          if (type === "vcard_download") update.vcardDownloads = inc;
          if (type === "qr_scan") update.qrScans = inc;
          if (type === "wa_click") update.waInquiries = inc;
          if (type === "call_click") update.callClicks = inc;
          if (type === "share_click") update.shareClicks = inc;
          db.collection("analytics").doc("stats_" + bId).set(update, { merge: true }).catch(function () {});
        }
      } catch (e) {}
    }

    // Render Public Collection Links in Tab 1
    function renderPublicLinks(links) {
      if (!els.linksPublic) return;
      els.linksPublic.innerHTML = "";

      const live = (links || [])
        .filter(function (item) { return item.active !== false; })
        .sort(function (a, b) { return Number(a.order || 0) - Number(b.order || 0); });

      if (!live.length) {
        els.linksPublic.innerHTML =
          '<div class="rounded-2xl border border-dashed border-amber-200/80 bg-white/70 p-6 text-center text-sm text-gray-500">' +
            '<p class="font-bold text-gray-800">No active collections yet</p>' +
            '<p class="text-xs text-gray-400 mt-1">Check back soon for new arrivals, luxury lawn, and festive edits.</p>' +
          '</div>';
        return;
      }

      live.forEach(function (link) {
        const a = document.createElement("a");
        a.href = link.url || "#";
        a.target = "_blank";
        a.rel = "noopener noreferrer";

        const isFeatured = link.featured === true;
        a.className = "link-pill" + (isFeatured ? " is-featured" : "");
        if (currentProfile.buttonBg && !isFeatured) {
          a.style.backgroundColor = currentProfile.buttonBg;
        }

        const iconStr = link.icon ? '<span class="mr-1.5">' + escapeHtml(link.icon) + '</span>' : '';
        const badgeStr = link.badge ? '<span class="link-badge">' + escapeHtml(link.badge) + '</span>' : '';
        const descStr = link.description ? '<p class="link-description">' + escapeHtml(link.description) + '</p>' : '';
        const imgSrc = escapeHtml(link.image || "assets/maryam_logo_refinement.avif");

        a.innerHTML =
          '<img src="' + imgSrc + '" class="link-thumbnail" alt="" loading="lazy" onerror="this.src=\'assets/maryam_logo_refinement.avif\'">' +
          '<div class="link-details">' +
            '<div class="link-header-row">' +
              '<h3 class="link-title">' + iconStr + escapeHtml(link.title || "Untitled Collection") + '</h3>' +
              badgeStr +
            '</div>' +
            descStr +
          '</div>' +
          '<div class="link-chevron" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>' +
          '</div>';

        a.addEventListener("click", function () {
          trackEvent("collection_click", link.title || "Collection");
        });

        els.linksPublic.appendChild(a);
      });
    }

    // Card 3D Parallax Tilt Effect on Cursor / Touch
    const cardPerspective = document.querySelector(".visiting-card-perspective");
    if (cardPerspective && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      let ticking = false;

      cardPerspective.addEventListener("mousemove", function (e) {
        if (!els.phoneCard || els.phoneCard.classList.contains("is-flipped")) return;
        const rect = cardPerspective.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const px = (x / rect.width) * 100;
        const py = (y / rect.height) * 100;

        const tiltX = ((y / rect.height) - 0.5) * -10;
        const tiltY = ((x / rect.width) - 0.5) * 10;

        if (!ticking) {
          window.requestAnimationFrame(function () {
            cardPerspective.style.setProperty("--mouse-x", px + "%");
            cardPerspective.style.setProperty("--mouse-y", py + "%");
            els.phoneCard.style.transform = "rotateX(" + tiltX.toFixed(2) + "deg) rotateY(" + tiltY.toFixed(2) + "deg)";
            ticking = false;
          });
          ticking = true;
        }
      });

      cardPerspective.addEventListener("mouseleave", function () {
        if (!els.phoneCard || els.phoneCard.classList.contains("is-flipped")) return;
        els.phoneCard.style.transition = "transform 0.5s var(--ease-spring)";
        els.phoneCard.style.transform = "rotateX(0deg) rotateY(0deg)";
        setTimeout(function () {
          if (els.phoneCard) els.phoneCard.style.transition = "";
        }, 500);
      });
    }

    // 3D Visiting Card Flip Interaction
    if (els.flipToBackBtn) {
      els.flipToBackBtn.addEventListener("click", function () {
        if (els.phoneCard) {
          els.phoneCard.style.transform = "";
          els.phoneCard.classList.add("is-flipped");
          trackEvent("qr_scan");
        }
      });
    }

    if (els.flipToFrontBtn) {
      els.flipToFrontBtn.addEventListener("click", function () {
        if (els.phoneCard) {
          els.phoneCard.style.transform = "";
          els.phoneCard.classList.remove("is-flipped");
        }
      });
    }

    // Tabs Navigation Interaction
    const tabButtons = document.querySelectorAll(".card-tab-btn");
    const tabPanels = document.querySelectorAll(".card-tab-content");

    tabButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const targetTabId = btn.dataset.tab;
        tabButtons.forEach(function (b) { b.classList.toggle("is-active", b === btn); });
        tabPanels.forEach(function (panel) {
          panel.classList.toggle("is-active", panel.id === targetTabId);
        });
      });
    });

    // Save Contact as standard .vcf Card
    function downloadVCard() {
      const name = currentProfile.brandName || "Maryam's Desgins";
      const org = currentProfile.brandName || "Maryam's Desgins";
      const website = currentProfile.website || "https://maryamsdesign.com";
      const email = currentProfile.email || "contact@maryamsdesign.com";
      const phone = cleanPhone(currentProfile.phone || currentProfile.whatsapp || "+92 300 0000000");
      const title = currentProfile.tagline || "Luxury Pret & Couture Edit";

      const vcard =
        "BEGIN:VCARD\r\n" +
        "VERSION:3.0\r\n" +
        "FN:" + name + "\r\n" +
        "ORG:" + org + "\r\n" +
        "TITLE:" + title + "\r\n" +
        "TEL;TYPE=CELL,VOICE:" + phone + "\r\n" +
        "EMAIL;TYPE=INTERNET,WORK:" + email + "\r\n" +
        "URL:" + website + "\r\n" +
        "NOTE:Official Digital Visiting Card - " + name + "\r\n" +
        "END:VCARD\r\n";

      const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = (name.replace(/\s+/g, "-") || "Maryams-Desgins") + ".vcf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast("Contact card downloaded!");
      trackEvent("vcard_download");
    }

    // Share Modal & QR Code
    function openShareModal() {
      const currentUrl = window.location.href;
      if (els.shareUrlInput) els.shareUrlInput.value = currentUrl;
      if (els.qrCodeImg) {
        els.qrCodeImg.src = "https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=6&color=2a-20-1a&data=" + encodeURIComponent(currentUrl);
      }
      if (els.shareWhatsappBtn) {
        const text = encodeURIComponent("Check out " + (currentProfile.brandName || "Maryam's Desgins") + "'s official digital card: " + currentUrl);
        els.shareWhatsappBtn.href = "https://wa.me/?text=" + text;
      }
      if (els.shareModal) {
        els.shareModal.classList.add("is-open");
      }
      trackEvent("share_click");
    }

    function closeShareModal() {
      if (els.shareModal) {
        els.shareModal.classList.remove("is-open");
      }
    }

    // Native Share / Fallback Share
    function handleShare() {
      const currentUrl = window.location.href;
      trackEvent("share_click");
      if (navigator.share) {
        navigator.share({
          title: currentProfile.brandName || "Maryam's Desgins",
          text: "Official Digital Visiting Card & Couture Collections",
          url: currentUrl
        }).catch(function (err) {
          if (err.name !== "AbortError") openShareModal();
        });
      } else {
        openShareModal();
      }
    }

    // Attach Event Listeners
    if (els.saveContactBtn) els.saveContactBtn.addEventListener("click", downloadVCard);
    if (els.shareCardBtn) els.shareCardBtn.addEventListener("click", handleShare);
    if (els.closeShareModalBtn) els.closeShareModalBtn.addEventListener("click", closeShareModal);
    if (els.cardWhatsappBtn) els.cardWhatsappBtn.addEventListener("click", function () { trackEvent("wa_click"); });
    if (els.whatsappLink) els.whatsappLink.addEventListener("click", function () { trackEvent("wa_click"); });
    if (els.callLink) els.callLink.addEventListener("click", function () { trackEvent("call_click"); });
    if (els.emailLink) els.emailLink.addEventListener("click", function () { trackEvent("email_click"); });
    if (els.mainCtaBtn) els.mainCtaBtn.addEventListener("click", function () { trackEvent("wa_click"); });

    if (els.shareModal) {
      els.shareModal.addEventListener("click", function (e) {
        if (e.target === els.shareModal) closeShareModal();
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && els.shareModal && els.shareModal.classList.contains("is-open")) {
        closeShareModal();
      }
      // Secret Admin Hotkey (Alt + A) - Frictionless admin access without a public button
      if (e.altKey && (e.key === "a" || e.key === "A")) {
        window.location.href = "admin.html";
      }
    });

    if (els.copyShareUrlBtn && els.shareUrlInput) {
      els.copyShareUrlBtn.addEventListener("click", function () {
        copyToClipboard(els.shareUrlInput.value, "Card link copied!");
      });
    }

    if (els.previewUsername) {
      els.previewUsername.addEventListener("click", function () {
        copyToClipboard(window.location.href, "Card link copied!");
      });
    }

    // ===================================================================
    // MULTI-BRAND & REALTIME FIRESTORE RESOLUTION
    // ===================================================================
    const urlParams = new URLSearchParams(window.location.search);
    const requestedBrand = urlParams.get("brand") || urlParams.get("b") || urlParams.get("id");

    if (db) {
      if (requestedBrand) {
        // Multi-Brand Mode: Load specific brand from Firestore
        // First try settings/brand_<slug>, then brands/<slug>
        const brandDocRef = db.collection("settings").doc("brand_" + requestedBrand);

        brandDocRef.onSnapshot(function (snap) {
          if (snap.exists) {
            const data = snap.data();
            applyProfile(data);
            if (data.links && Array.isArray(data.links)) {
              renderPublicLinks(data.links);
            } else {
              loadRootLinks();
            }
          } else {
            // Check direct brands collection as fallback
            db.collection("brands").doc(requestedBrand).onSnapshot(function (bSnap) {
              if (bSnap.exists) {
                const bData = bSnap.data();
                applyProfile(bData);
                if (bData.links && Array.isArray(bData.links)) {
                  renderPublicLinks(bData.links);
                } else {
                  loadRootLinks();
                }
              } else {
                // Fallback to default
                loadDefaultBrand();
              }
            }, function () {
              loadDefaultBrand();
            });
          }
        }, function () {
          loadDefaultBrand();
        });
      } else {
        // Default Primary Brand (100% Backward Compatible)
        loadDefaultBrand();
      }
    } else {
      // Offline fallback
      applyProfile(DEFAULT_PROFILE);
    }

    function loadDefaultBrand() {
      if (!db) return;
      db.collection("settings").doc("profile").onSnapshot(function (snap) {
        if (snap.exists) {
          applyProfile(snap.data());
        } else {
          applyProfile(DEFAULT_PROFILE);
        }
      }, function () {
        applyProfile(DEFAULT_PROFILE);
      });

      loadRootLinks();
    }

    function loadRootLinks() {
      if (!db) return;
      db.collection("links").orderBy("order", "asc").onSnapshot(function (snap) {
        renderPublicLinks(snap.docs.map(function (d) { return { id: d.id, ...d.data() }; }));
      }, function (error) {
        if (els.linksPublic) {
          els.linksPublic.innerHTML =
            '<div class="rounded-2xl bg-amber-50 p-4 text-center text-xs text-amber-800">' +
              'Collections loading notice: ' + escapeHtml(error.message) +
            '</div>';
        }
      });
    }

    // Record initial page visit
    trackEvent("page_view");
  });
})();
