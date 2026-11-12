const DEFAULT_PROFILE = {
  brandName: "Boutique Maryam",
  username: "boutiquemaryam.pk",
  logoUrl: "assets/logo.png",
  instagram: "https://instagram.com/",
  facebook: "https://facebook.com/",
  whatsapp: "https://wa.me/923000000000",
  tiktok: "https://www.tiktok.com/",
  pinterest: "https://www.pinterest.com/",
  website: "https://boutiquemaryam.pk/",
  themeBg: "#ffffff",
  pageBg: "#fff8fc",
  buttonBg: "#ffffff",
  textColor: "#0f0f14"
};

(function () {
  firebase.initializeApp(window.firebaseConfig);
  const db = firebase.firestore();

  document.addEventListener("DOMContentLoaded", function () {
    const els = {
      phoneCard: document.getElementById("phoneCard"),
      previewLogo: document.getElementById("previewLogo"),
      previewBrand: document.getElementById("previewBrand"),
      previewUsername: document.getElementById("previewUsername"),
      instagramLink: document.getElementById("instagramLink"),
      facebookLink: document.getElementById("facebookLink"),
      whatsappLink: document.getElementById("whatsappLink"),
      tiktokLink: document.getElementById("tiktokLink"),
      pinterestLink: document.getElementById("pinterestLink"),
      websiteLink: document.getElementById("websiteLink"),
      linksPublic: document.getElementById("linksPublic"),
      saveContactBtn: document.getElementById("saveContactBtn"),
      shareCardBtn: document.getElementById("shareCardBtn"),
      shareModal: document.getElementById("shareModal"),
      closeShareModalBtn: document.getElementById("closeShareModalBtn"),
      qrCodeImg: document.getElementById("qrCodeImg"),
      shareUrlInput: document.getElementById("shareUrlInput"),
      copyShareUrlBtn: document.getElementById("copyShareUrlBtn"),
      shareWhatsappBtn: document.getElementById("shareWhatsappBtn"),
      toastContainer: document.getElementById("toastContainer"),
      mainCtaBtn: document.getElementById("mainCtaBtn")
    };

    let currentProfile = { ...DEFAULT_PROFILE };

    function escapeHtml(str) {
      return String(str || "").replace(/[&<>"']/g, function (m) {
        return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m];
      });
    }

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

    function applyProfile(data) {
      currentProfile = { ...DEFAULT_PROFILE, ...(data || {}) };

      // Apply Page Background
      if (currentProfile.pageBg) {
        document.body.style.background =
          "radial-gradient(at 15% 15%, rgba(216,50,139,0.12) 0px, transparent 45%), " +
          "radial-gradient(at 85% 20%, rgba(194,157,89,0.10) 0px, transparent 40%), " +
          "linear-gradient(180deg, " + currentProfile.pageBg + " 0%, #f7edf3 100%)";
      }

      // Apply Card Background & Text Color
      if (els.phoneCard) {
        if (currentProfile.themeBg) els.phoneCard.style.backgroundColor = currentProfile.themeBg;
        if (currentProfile.textColor) els.phoneCard.style.color = currentProfile.textColor;
      }

      // Brand Logo & Text
      if (els.previewLogo) els.previewLogo.src = currentProfile.logoUrl || "assets/logo.png";
      if (els.previewBrand) els.previewBrand.textContent = currentProfile.brandName || "Boutique Maryam";

      if (els.previewUsername) {
        const usernameText = currentProfile.username ? (currentProfile.username.startsWith("@") ? currentProfile.username : "@" + currentProfile.username) : "@boutiquemaryam.pk";
        const span = els.previewUsername.querySelector("span");
        if (span) span.textContent = usernameText;
        else els.previewUsername.textContent = usernameText;
      }

      // Social Links
      if (els.instagramLink) els.instagramLink.href = currentProfile.instagram || "#";
      if (els.facebookLink) els.facebookLink.href = currentProfile.facebook || "#";
      if (els.whatsappLink) {
        els.whatsappLink.href = currentProfile.whatsapp || "#";
        if (els.mainCtaBtn) els.mainCtaBtn.href = currentProfile.whatsapp || "#";
      }
      if (els.tiktokLink) els.tiktokLink.href = currentProfile.tiktok || "#";
      if (els.pinterestLink) els.pinterestLink.href = currentProfile.pinterest || "#";
      if (els.websiteLink) els.websiteLink.href = currentProfile.website || "#";
    }

    function renderPublicLinks(links) {
      if (!els.linksPublic) return;
      els.linksPublic.innerHTML = "";

      const live = (links || [])
        .filter(function (item) { return item.active !== false; })
        .sort(function (a, b) { return Number(a.order || 0) - Number(b.order || 0); });

      if (!live.length) {
        els.linksPublic.innerHTML =
          '<div class="rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 p-6 text-center text-sm text-gray-500">' +
            '<p class="font-bold text-gray-700">No active collections yet</p>' +
            '<p class="text-xs text-gray-400 mt-1">Check back soon for latest arrivals and seasonal edits.</p>' +
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

        const iconStr = link.icon ? '<span class="mr-1">' + escapeHtml(link.icon) + '</span>' : '';
        const badgeStr = link.badge ? '<span class="link-badge">' + escapeHtml(link.badge) + '</span>' : '';
        const descStr = link.description ? '<p class="link-description">' + escapeHtml(link.description) + '</p>' : '';
        const imgSrc = escapeHtml(link.image || "assets/logo.png");

        a.innerHTML =
          '<img src="' + imgSrc + '" class="link-thumbnail" alt="" loading="lazy" onerror="this.src=\'assets/logo.png\'">' +
          '<div class="link-details">' +
            '<div class="link-header-row">' +
              '<h3 class="link-title">' + iconStr + escapeHtml(link.title || "Untitled Link") + '</h3>' +
              badgeStr +
            '</div>' +
            descStr +
          '</div>' +
          '<div class="link-chevron" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>' +
          '</div>';

        els.linksPublic.appendChild(a);
      });
    }

    // Save Contact as standard .vcf Card
    function downloadVCard() {
      const name = currentProfile.brandName || "Boutique Maryam";
      const org = currentProfile.brandName || "Boutique Maryam";
      const website = currentProfile.website || "https://boutiquemaryam.pk";
      const rawWa = currentProfile.whatsapp || "";
      let phone = "";
      if (rawWa.includes("wa.me/")) {
        phone = "+" + rawWa.split("wa.me/")[1].replace(/[^0-9]/g, "");
      } else if (rawWa.includes("phone=")) {
        phone = "+" + rawWa.split("phone=")[1].replace(/[^0-9]/g, "");
      } else {
        phone = "+92 300 0000000";
      }

      const vcard =
        "BEGIN:VCARD\r\n" +
        "VERSION:3.0\r\n" +
        "FN:" + name + "\r\n" +
        "ORG:" + org + "\r\n" +
        "TITLE:Luxury Pret & Couture Edit\r\n" +
        "TEL;TYPE=CELL,VOICE:" + phone + "\r\n" +
        "URL:" + website + "\r\n" +
        "NOTE:Official Digital Visiting Card - " + name + "\r\n" +
        "END:VCARD\r\n";

      const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = (name.replace(/\s+/g, "-") || "Boutique-Maryam") + ".vcf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast("Contact card downloaded!");
    }

    // Share Modal & QR Code
    function openShareModal() {
      const currentUrl = window.location.href;
      if (els.shareUrlInput) els.shareUrlInput.value = currentUrl;
      if (els.qrCodeImg) {
        els.qrCodeImg.src = "https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=4&data=" + encodeURIComponent(currentUrl);
      }
      if (els.shareWhatsappBtn) {
        const text = encodeURIComponent("Check out " + (currentProfile.brandName || "Boutique Maryam") + "'s official digital card: " + currentUrl);
        els.shareWhatsappBtn.href = "https://wa.me/?text=" + text;
      }
      if (els.shareModal) {
        els.shareModal.classList.add("is-open");
      }
    }

    function closeShareModal() {
      if (els.shareModal) {
        els.shareModal.classList.remove("is-open");
      }
    }

    // Native Share / Fallback Share
    function handleShare() {
      const currentUrl = window.location.href;
      if (navigator.share) {
        navigator.share({
          title: currentProfile.brandName || "Boutique Maryam",
          text: "Official Digital Card & Collections",
          url: currentUrl
        }).catch(function (err) {
          if (err.name !== "AbortError") openShareModal();
        });
      } else {
        openShareModal();
      }
    }

    // Attach Interactive Event Listeners
    if (els.saveContactBtn) {
      els.saveContactBtn.addEventListener("click", downloadVCard);
    }

    if (els.shareCardBtn) {
      els.shareCardBtn.addEventListener("click", handleShare);
    }

    if (els.closeShareModalBtn) {
      els.closeShareModalBtn.addEventListener("click", closeShareModal);
    }

    if (els.shareModal) {
      els.shareModal.addEventListener("click", function (e) {
        if (e.target === els.shareModal) closeShareModal();
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && els.shareModal && els.shareModal.classList.contains("is-open")) {
        closeShareModal();
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

    // Firestore Listeners
    db.collection("settings").doc("profile").onSnapshot(function (snap) {
      applyProfile(snap.exists ? snap.data() : DEFAULT_PROFILE);
    }, function () {
      applyProfile(DEFAULT_PROFILE);
    });

    db.collection("links").orderBy("order", "asc").onSnapshot(function (snap) {
      renderPublicLinks(snap.docs.map(function (d) { return { id: d.id, ...d.data() }; }));
    }, function (error) {
      if (els.linksPublic) {
        els.linksPublic.innerHTML =
          '<div class="rounded-2xl bg-red-50 p-4 text-center text-sm text-red-700">' +
            'Links load error: ' + escapeHtml(error.message) +
          '</div>';
      }
    });
  });
})();
