import sys, glob, os
from PIL import Image, ImageDraw
root=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','public','assets','cyberdesk')
def sheet(pattern, outp, cell=96, cols=10, bg=(0,128,128)):
    files=sorted(glob.glob(os.path.join(root,pattern),recursive=True))
    rows=(len(files)+cols-1)//cols
    im=Image.new('RGB',(cols*cell,rows*(cell+12)),bg); d=ImageDraw.Draw(im)
    for i,f in enumerate(files):
        a=Image.open(f).convert('RGBA'); k=min((cell-8)/a.width,(cell-8)/a.height)
        k = max(1,int(k)) if k>=1 else k
        a=a.resize((max(1,int(a.width*k)),max(1,int(a.height*k))),Image.NEAREST)
        x=(i%cols)*cell+(cell-a.width)//2; y=(i//cols)*(cell+12)+(cell-a.height)//2
        im.paste(a,(x,y),a); d.text(((i%cols)*cell+2,(i//cols)*(cell+12)+cell-2),os.path.basename(f)[:16],fill=(255,255,255))
    im.save(outp); print(outp,len(files))
if __name__=='__main__':
    sheet(sys.argv[1],sys.argv[2],int(sys.argv[3]) if len(sys.argv)>3 else 96,int(sys.argv[4]) if len(sys.argv)>4 else 10)
