const thumbnailVideo = document.querySelectorAll(".thumbnailBlock__thumbnail");
const searchVideo = document.querySelectorAll(".searchVideo");
const videoBlockThumbnail = document.querySelectorAll(".videoBlock__thumbnail");
const detailVideo = document.querySelectorAll(".detailVideo");

// console.log(thumbnailVideo);
// console.log(searchVideo);
// console.log(videoBlockThumbnail);

const handleThumbnailVideo = () => {
  if (thumbnailVideo.length > 0) {
    for (let i = 0; i < thumbnailVideo.length; i++) {
      thumbnailVideo[i].addEventListener("mouseover", function () {
        thumbnailVideo[i].play();
      });
      thumbnailVideo[i].addEventListener("mouseout", function () {
        thumbnailVideo[i].pause();
      });
    }
  }
};

const handleSearchVideo = () => {
  if (searchVideo.length > 0) {
    for (let i = 0; i < searchVideo.length; i++) {
      searchVideo[i].addEventListener("mouseover", function () {
        searchVideo[i].play();
      });
      searchVideo[i].addEventListener("mouseout", function () {
        searchVideo[i].pause();
      });
    }
  }
};

const handleVideoBlockThumbnail = () => {
  if (videoBlockThumbnail.length > 0) {
    for (let i = 0; i < videoBlockThumbnail.length; i++) {
      videoBlockThumbnail[i].addEventListener("mouseover", function () {
        videoBlockThumbnail[i].play();
      });
      videoBlockThumbnail[i].addEventListener("mouseout", function () {
        videoBlockThumbnail[i].pause();
      });
    }
  }
};

const handleDetailVideo = () => {
  if (detailVideo.length > 0) {
    for (let i = 0; i < detailVideo.length; i++) {
      detailVideo[i].addEventListener("mouseover", function () {
        detailVideo[i].play();
      });
      detailVideo[i].addEventListener("mouseout", function () {
        detailVideo[i].pause();
      });
    }
  }
};

if (thumbnailVideo.length > 0) {
  handleThumbnailVideo();
} else if (searchVideo.length > 0) {
  handleSearchVideo();
} else if (videoBlockThumbnail.length > 0) {
  handleVideoBlockThumbnail();
} else if (detailVideo.length > 0) {
  handleDetailVideo();
}
