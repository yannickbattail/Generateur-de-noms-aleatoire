class Resource {
  Name : string;
  constructor(name: string) {
    this.Name = name;
  }
}

class ResourceQuantity {
  Resource : Resource;
  Quantity : number;
  constructor(resource : Resource, quantity : number) {
    this.Resource = resource;
    this.Quantity = quantity;
  }
}

class Source {
  Name : string;
  Resource : ResourceQuantity;
  SourceType : string =  "timed";
  Interval : number = 1000;
  LastTime : Date = new Date();
  constructor(name: string, resource : ResourceQuantity, sourceType : string =  "timed", interval : number = 1) {
    this.Name = name;
    this.Resource = resource;
    this.SourceType = sourceType;
    this.Interval = interval;
  }
}

class Trigger {
  name: string;
  ResourcesTrigger: Array<ResourceQuantity> = [];
  TriggeredSources: Source;
  TriggeredNewTriggers: Array<Trigger> = [];
  TriggeredResources: Array<ResourceQuantity> = [];
}

class Crafter {
  Name: string;
  Duration: number;
  AutoCrafting: boolean = false;
  Cost: Array<ResourceQuantity> = [];
  CraftedResource: ResourceQuantity;
}


class Player {
  Name: string;
  Storage: Array<ResourceQuantity> = new Array<ResourceQuantity>();
  constructor(Name: string) {
    this.Name = Name;
  }
  changeStorage(resourceQuantity : ResourceQuantity) {
    let resQ = this.getResourceInStorage(resourceQuantity.Resource.Name);
    if (!resQ) {
      this.Storage.push(new ResourceQuantity(resourceQuantity.Resource, resourceQuantity.Quantity));
    } else {
      resQ.Quantity += resourceQuantity.Quantity;
    }
  }
  getResourceInStorage(resourceName : string) : ResourceQuantity | null {
    let res = this.Storage.filter((res : ResourceQuantity) => res.Resource.Name == resourceName);
    if (res.length) {
      return res[0];
    }
    return null;
  }
}

class Engine {
  tick : number = 1000;
  Player : Player;
  Sources: Array<Source> = [];
  Triggers: Array<Trigger> = [];
  Crafters: Array<Crafter> = [];
  run() {
    window.setInterval(() => this.runTick(), 1000);
  }
  private runTick() {
    let s = this.Sources;
    s.forEach(
      source => this.collectSource(source)
    );
    console.log(this.Player);
  }
  private collectSource(source : Source) {
    if (source.LastTime.getTime() + source.Interval < new Date().getTime()) {
      source.LastTime = new Date();
      this.Player.changeStorage(source.Resource);
    }
  }
}

const IRON = new Resource("iron");
const COPER = new Resource("coper");

var engine = new Engine();
engine.Player = new Player("platypus");
engine.Sources = [
  new Source("iron mine", new ResourceQuantity(IRON, 2), "timed", 500),
  new Source("coper mine", new ResourceQuantity(COPER, 1), "timed", 3000)
];
