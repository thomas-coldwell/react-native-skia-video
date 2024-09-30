#pragma once

#include <GLES/egl.h>
#include <WorkletRuntime.h>
#include <fbjni/fbjni.h>
#include <react-native-skia/JsiSkCanvas.h>
#include <react-native-skia/include/core/SkSurface.h>

#include "VideoComposition.h"
#include "VideoFrame.h"

namespace RNSkiaVideo {
using namespace facebook;
using namespace jni;

class VideoCompositionExporter : public HybridClass<VideoCompositionExporter> {
public:
  static constexpr auto kJavaDescriptor =
      "Lcom/azzapp/rnskv/VideoCompositionExporter;";
  static global_ref<VideoCompositionExporter::JavaPart>
  create(alias_ref<VideoComposition> composition, std::string& outPath,
         int width, int height, int frameRate, int bitRate,
         std::optional<std::string> encoderName,
         std::shared_ptr<reanimated::WorkletRuntime> workletRuntime,
         std::shared_ptr<reanimated::ShareableWorklet> drawFrame);

  explicit VideoCompositionExporter(
      int width, int height,
      std::shared_ptr<reanimated::WorkletRuntime> workletRuntime,
      std::shared_ptr<reanimated::ShareableWorklet> drawFrame);

  static void registerNatives();

  static jsi::Value exportVideoComposition(
      jsi::Runtime& runtime, jsi::Object composition, jsi::Object options,
      std::shared_ptr<reanimated::WorkletRuntime> workletRuntime,
      std::shared_ptr<reanimated::ShareableWorklet> drawFrame,
      std::shared_ptr<jsi::Function> onSuccess,
      std::shared_ptr<jsi::Function> onError,
      std::shared_ptr<jsi::Function> onProgress);

private:
  friend HybridBase;
  jni::global_ref<javaobject> jThis;
  int width;
  int height;
  std::shared_ptr<reanimated::WorkletRuntime> workletRuntime;
  std::shared_ptr<reanimated::ShareableWorklet> drawFrameWorklet;
  std::function<void()> onCompleteCallback;
  std::function<void(alias_ref<JObject> e)> onErrorCallback;
  std::function<void(int frame)> onProgressCallback;
  sk_sp<SkSurface> surface;
  std::shared_ptr<RNSkia::JsiSkCanvas> jsiSkCanvas;

  void start(std::function<void()> onCompleteCallback,
             std::function<void(alias_ref<JObject> e)> onErrorCallback,
             std::function<void(int frame)> onProgressCallback);
  void makeSkiaSharedContextCurrent();
  void onProgress(jint frame);
  int renderFrame(jdouble timeUS, alias_ref<JMap<JString, VideoFrame>> frames);
  void onComplete();
  void onError(alias_ref<JObject> e);
  void release();
};

} // namespace RNSkiaVideo
