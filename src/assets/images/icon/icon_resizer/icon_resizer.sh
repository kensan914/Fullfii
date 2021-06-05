# sh icon_resizer.sh ../icon.jpg

size=(20 40 60 29 58 87 80 120 180 76 152 167 1024)
for i in "${size[@]}"
do
  : 
    ffmpeg -i $1 -vf scale=$i:$i $ix$i.jpg
done
