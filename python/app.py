from tkinter import * 

def alert():
    showinfo("alerte", "Bravo!")
    
def quit(self):
    self.root.destroy()


fenetre = Tk()

label = Label(fenetre, text="Hello World")
label.pack()

# entrée
value = StringVar() 
value.set("texte par défaut")
entree = Entry(fenetre, width=30)
entree.pack()

# bouton de sortie
bouton=Button(fenetre, text="Fermer", command=fenetre.destroy)
bouton.pack()

menubar = Menu(fenetre)

menu1 = Menu(menubar, tearoff=0)
menu1.add_command(label="Créer", command=alert)
menu1.add_command(label="Editer", command=alert)
menu1.add_separator()
menu1.add_command(label="Quitter", command=fenetre.destroy)
menubar.add_cascade(label="Fichier", menu=menu1)

menu2 = Menu(menubar, tearoff=0)
menu2.add_command(label="Couper", command=alert)
menu2.add_command(label="Copier", command=alert)
menu2.add_command(label="Coller", command=alert)
menubar.add_cascade(label="Editer", menu=menu2)

menu3 = Menu(menubar, tearoff=0)
menu3.add_command(label="A propos", command=alert)
menubar.add_cascade(label="Aide", menu=menu3)

fenetre.config(menu=menubar)


fenetre.mainloop()
