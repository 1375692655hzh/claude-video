#!/usr/bin/env bash
# 音效统一后期：让一套音效听起来像同一个系列。
# 用法：bash tools/sfx-unify.sh <输入.wav> <输出.mp3> [目标RMS dB，默认 -18]
#
# 1. 去掉首尾静音（-50 dB）
# 2. 统一 EQ：40 Hz 以下切掉，11 kHz 以上轻微压低
# 3. 同一个很轻的短房间混响（同一空间感）
# 4. 按"有声部分"的平均响度（RMS）对齐到目标值，峰值封顶 -1 dB
# 5. 结尾 30ms 淡出，44.1kHz 立体声 192k mp3
in="$1"; out="$2"; target="${3:--18}"
[ -f "$in" ] && [ -n "$out" ] || { echo "用法：bash tools/sfx-unify.sh <输入.wav> <输出.mp3> [目标RMS]"; exit 1; }
tmp="${out%.mp3}.tmp.wav"
ffmpeg -v error -y -i "$in" -af "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.01,areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.05,areverse,highpass=f=40,highshelf=f=11000:g=-3,aecho=0.9:0.6:18|37:0.12|0.07" -ar 44100 -ac 2 "$tmp" || exit 1
stats=$(ffmpeg -hide_banner -i "$tmp" -af volumedetect -f null - 2>&1)
rms=$(echo "$stats" | sed -n 's/.*mean_volume: \(-\?[0-9.]*\) dB.*/\1/p')
peak=$(echo "$stats" | sed -n 's/.*max_volume: \(-\?[0-9.]*\) dB.*/\1/p')
gain=$(awk -v r="$rms" -v p="$peak" -v t="$target" 'BEGIN{g=t-r; if (p+g>-1) g=-1-p; printf "%.2f", g}')
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$tmp")
fade=$(awk -v d="$dur" 'BEGIN{s=d-0.03; if (s<0) s=0; printf "%.3f", s}')
ffmpeg -v error -y -i "$tmp" -af "volume=${gain}dB,afade=t=out:st=${fade}:d=0.03" -c:a libmp3lame -b:a 192k "$out" || exit 1
rm -f "$tmp"
printf "%-24s RMS %6s → %6s dB（增益 %6s，峰值 %6s → %6.1f），时长 %.2fs\n" "$(basename "$out")" "$rms" "$(awk -v r="$rms" -v g="$gain" 'BEGIN{printf "%.1f", r+g}')" "$gain" "$peak" "$(awk -v p="$peak" -v g="$gain" 'BEGIN{print p+g}')" "$dur"
