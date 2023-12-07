# firewalld

rôle pour configurer le firewalld, via une config yaml.

ex.

```
firewall_rules:
  - name: allow some icmp
    sources: [0.0.0.0/0]
    family: ipv4
    icmps:
      - echo-request
      - echo-reply
      - fragmentation-needed
      - time-exceeded
      - destination-unreachable
    limit: 10/s
    
  - name: ssh from proxyjump
    sources:
      - 192.168.0.10/32   # proxyjump1
      - 192.168.0.11/32   # proxyjump2
    services:
      - ssh
      
  - name: node_exporter from monitoring
    sources:
      - 102.168.0.23/32   # prometheus server
    ports:
      - 9100/tcp

  - name: réception des offer/ack/nak dhcp
    sources: [0.0.0.0/0]
    ports: [68/udp]
```

# merge de la variable firewall_rules

Tous les instances de la variable `firewall_rules` sont mergés.

Le fonctionnement par défaut de ansible est d’écraser les variables par celle la plus "proche". https://docs.ansible.com/ansible/latest/user_guide/playbooks_variables.html#understanding-variable-precedence

Pour la variable `firewall_rules`, nous voulons la merger si elle est présent dans plusieurs fichiers `group_vars`.

Ca permet de définir la même variable `firewall_rules` dans les plusieurs fichiers, exemple: `all.yml`, le `login.yaml`, et le `host_vars`. Les règles définis dans ces trois fichiers seront tous appliquées sur le host. (plutôt que de seulement avoir ceux définis dans le `host_vars` qui écrase ceux des `group_vars`.)

Ça évite donc d'avoir des noms de variables par "étage". (ie. `firewall_rules_all, firewall_rules_group, firewall_rules_host`)

Le principe est relativement simple, les tasks définis de le fichier `tasks/main.yml` font des **include_vars** de tous les fichiers vars en relation avec le host. Il fait ensuite un `set_fact` pour merger tous les instances de la variable `firewall_rules`.

L'ordre de chargement des fichiers vars est celui-ci:

1. all.yml
2. tous les fichiers groups vars dont le host est membre. (en ordre alphabétique)
3. le host_vars

**ATTENTION**: Il y a toujours un risque de collision. Si la même règle est définis a deux endroits, elle sera appliqué deux fois, sans erreur ansible. Ce n'est pas une erreur en soit, mais pas nécessairement l'objectif recherché. Il faudrait peut-être ajouter une détection de collision, et faire un **assert** pour causer une erreur ansible, et éviter que ça passe sous silence.
