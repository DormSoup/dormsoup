while inotifywait -r ./ -e modify,create,delete; do
    rsync -auvz \
        --exclude='/.git' --filter="dir-merge,- .gitignore" \
        ./ hakken-aws-arm:/home/ubuntu/hakken 
done