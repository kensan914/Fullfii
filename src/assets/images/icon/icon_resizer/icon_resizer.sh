# sh icon_resizer.sh ../icon.jpg

for i in "${size[@]}"
do
  : 
    ffmpeg -i $1 -vf scale=$i:$i $ix$i.jpg
done
