# Command line options

```

  Usage: manginx [options] [command]

  Options:

    -V, --version            output the version number
    -p, --port <n>           Port definition. By default : 80 
    -h, --help               output usage information

  Commands:

    start|-s [options]       Start nginx
    stop|-k                  Stop all nginx process.
    restart|-r               restart the server
    template [otherArgs...]  Command for registering, list or remove templates. tape "template -h" for more information
    use|-u <name>             add an template to the next nginx configuration
    list|-l                  List the used templates
    delete|-d <name>         Remove an configuration template

```

## list

List the used template for nginx's configuration

## use 

Add an templare to the nginx's configuration

## delete 

Remove an templare to the nginx's configuration

## start

Start one nginx instance with the currents template.

  
## stop

Stop all nginx instances on the current machine.

## restart

Do stop and start commands.

## template

Default output :

```
        - add <name> <confFile> : Add an new template.
        - remove <name> : Remove an template.
        - list : list all registered templates.
```

### add 

Add an new template.

### remove 

Remove an template.

### list

List all registered templates.