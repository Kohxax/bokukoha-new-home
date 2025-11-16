<script setup>
import { Share2, Link2, Rss } from "lucide-vue-next";
import MisskeyIcon from "../svg/MisskeyIcon.vue";
import XIcon from "../svg/XIcon.vue";

const props = defineProps({
  title: {
    type: String,
    default: "このページをシェア",
  },
  showRSS: {
    type: Boolean,
    default: false,
  }
});

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
  } catch (err) {
    console.error("リンクコピーに失敗しました", err);
  }
};

const openRSS = () => {
  const url = "https://www.bokukoha.dev/rss.xml"
  window.open(url, "_blank")
}

const shareToX = () => {
  const text = encodeURIComponent(document.title);
  const url = encodeURIComponent(window.location.href);
  const shareUrl = `https://x.com/intent/tweet?text=${text}&url=${url}`;
  window.open(shareUrl, "_blank", "width=500,height=400");
};

const shareToMisskey = () => {
  const text = encodeURIComponent(document.title);
  const url = encodeURIComponent(window.location.href);
  const shareUrl = `https://misskeyshare.link/share.html?text=${text}&url=${url}`;
  window.open(shareUrl, "_blank", "width=500,height=400");
};
</script>

<template>
  <div class="">
    <div class="flex items-center justify-center gap-2 mb-4">
      <Share2 class="h-5 w-5 text-muted-foreground " />
      <h3 class="font-semibold text-base ">{{ title }}</h3>
    </div>

    <div class="flex gap-6 text-muted-foreground pl-2">
      <button class="hover:text-sky-400 transition" @click="copyLink" title="リンクをコピー">
        <Link2 class="h-6 w-6" />
      </button>

      <button class="hover:text-foreground transition" @click="shareToX" title="Xでシェア">
        <XIcon class="h-6 w-6 scale-93" />
      </button>

      <button class="hover:text-green-400 transition" @click="shareToMisskey" title="Misskeyでシェア">
        <MisskeyIcon class="h-6 w-6" />
      </button>

      <button v-if="showRSS" class="hover:text-orange-400 transition" @click="openRSS" title="RSSフィードを開く">
        <Rss class="h-6 w-6" />
      </button>
    </div>
  </div>
</template>
