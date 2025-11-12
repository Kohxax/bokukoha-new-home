<script setup>
import { ref, onMounted } from "vue";
import { Heart } from "lucide-vue-next";

const props = defineProps({
    articleId: {
        type: String,
        required: true,
    },
});

const likeCount = ref(0);
const liked = ref(false);
const LIMIT = 1;

const config = useRuntimeConfig()
const apiEndpoint = config.public.likeApi;
const apiKey = config.public.likeApiKey;

const localKey = `user_like_count_${props.articleId}`;

onMounted(async () => {
    const res = await fetch(`${apiEndpoint}/${encodeURIComponent(props.articleId)}`, {
        headers: { "x-api-key": apiKey },
    });
    const data = await res.json();
    likeCount.value = data.likes || 0;

    const userLikes = parseInt(localStorage.getItem(localKey) || "0");
    if (userLikes >= LIMIT) liked.value = true;
});

const handleLike = async () => {
    if (liked.value) return;

    liked.value = true;
    likeCount.value++;
    localStorage.setItem(localKey, "1");

    const id = props.articleId
    await fetch(`${apiEndpoint}/${encodeURIComponent(id)}`, {
        method: "POST",
        headers: { "x-api-key": apiKey },
    });
};
</script>

<template>
    <div class="flex flex-col items-center">
        <button @click="handleLike"
            class="flex items-center gap-3 rounded-3xl px-6 py-4 text-2xl transition-all select-none" :class="{
                'text-muted-foreground opacity-70 cursor-not-allowed': liked
            }">
            <Heart class="w-9 h-9"
                :class="liked ? 'text-muted-foreground fill-muted-foreground' : 'text-red-400 fill-red-400 hover:scale-110'" />
            <transition name="like-bump" mode="out-in">
                <span :key="likeCount">{{ likeCount }}</span>
            </transition>
        </button>
    </div>
</template>

<style scoped>
.like-bump-enter-active {
    transition: all 0.28s ease;
}

.like-bump-leave-active {
    transition: all 0.2s ease;
    position: absolute;
}

.like-bump-enter-from {
    transform: translateY(6px);
    opacity: 0;
}

.like-bump-leave-to {
    transform: translateY(-6px);
    opacity: 0;
}
</style>
